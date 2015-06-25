var AWS = require('aws-sdk');
var async = require('async');
var _ = require('lodash');

// Copy the tags from the volume to the snapshot
function copyVolumeTags(snapshot, callback) {
  var params = {
    Resources: [snapshot.snapshotId],
    Tags: snapshot.tags
  };

  (new AWS.EC2({
    region: snapshot.region
  })).createTags(params, function(err) {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
}

// Grab all of the volumes that are tagged with required tags for a region
function getTaggedVolumesByRegion(region, callback) {
  (new AWS.EC2({
    region: region
  })).describeVolumes({
    Filters: [{
      Name: "tag-key",
      Values: [
        "Name",
        "Project",
        "Owner"
      ]
    }]
  }, function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, {
        region: region,
        volumes: data.Volumes
      });
    }
  });
}

// Grab all snapshots for a volume
function getSnapshotsForVolumeByRegion(region, callback) {
  var volumeIds = _(region.volumes)
    .pluck("Attachments")
    .flatten()
    .value()
    .map(function(volume) {
      return volume.VolumeId;
    });

  if (volumeIds.length > 0) {
    (new AWS.EC2({
      region: region.region
    })).describeSnapshots({
      Filters: [{
        Name: "volume-id",
        Values: volumeIds
      }]
    }, function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        var snapshots = data.Snapshots
          .map(function(snapshot) {
            var tags = _.pluck(_.where(region.volumes, {
              VolumeId: snapshot.VolumeId
            }), "Tags");

            return {
              snapshotId: snapshot.SnapshotId,
              volumeId: snapshot.VolumeId,
              region: region.region,
              tags: _(tags).flatten().value()
            };
          });

        callback(null, snapshots);
      }
    })
  } else {
    // region has no tagged volumes
    callback();
  }
}

exports.handler = function(event, context) {
  (new AWS.EC2()).describeRegions({}, function(err, data) {
    if (err) {
      context.fail(err);
    } else {
      var regions = data.Regions.map(function(region) {
        return region.RegionName;
      });

      async.map(regions, getTaggedVolumesByRegion, function(err, regions) {
        if (err) {
          context.fail(err);
        } else {
          async.map(regions, getSnapshotsForVolumeByRegion,
            function(err, volumes) {
              if (err) {
                context.fail(err);
              } else {
                async.each(_.flatten(_.compact(volumes)), copyVolumeTags,
                  function(err) {
                    if (err) {
                      context.fail(err);
                    } else {
                      context.succeed("All volume tags have been applied");
                    }
                  });
              }
            });
        }
      });
    }
  });
}

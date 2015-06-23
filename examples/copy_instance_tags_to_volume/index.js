var AWS = require('aws-sdk');
var async = require('async');
var _ = require('lodash');

// Copy the tags from the instance to the volume
function copyInstanceTags(volume, callback) {
  var tags = [];
  for (var name in volume.tags) {
    tags.push({ Key: name, Value: volume.tags[name] });
  }

  var params = {
    Resources: [ volume.volumeId ],
    Tags: tags
  };

  (new AWS.EC2({ region: volume.region })).createTags(params, function(err) {
    if (err) {
      callback(err);
    }
    else {
      callback();
    }
  });
}

// Grab all of the volumes that are "in-use" for a region
function getAttachedVolumesByRegion(region, callback) {
  (new AWS.EC2({region: region})).describeVolumes({
    Filters: [{
      Name: "status",
      Values: [
        "in-use"
      ]
    }]
  }, function(err, data) {
    if (err) {
      callback(err, null);
    }
    else {
      callback(null, {
        region: region,
        volumes: data.Volumes
      });
    }
  });
}

// Grab all instance tags for all of the volumes of a region
function getInstanceTagsForVolumeByRegion(region, callback) {
  var instances = _(region.volumes)
  .pluck("Attachments")
  .flatten()
  .value()
  .map(function(volume) {
    return {
      region: region.region,
      volumeId: volume.VolumeId,
      instanceId: volume.InstanceId
    };
  });

  if (instances.length > 0) {
    (new AWS.EC2({ region: region.region })).describeInstances({
      InstanceIds: _(instances).pluck("instanceId").value()
    }, function(err, data) {
      if (err) {
        callback(err, null);
      }
      else {
        instances = _.map(instances, function(instance) {
          var ec2Instance = _(data.Reservations)
          .pluck("Instances")
          .flatten()
          .value()
          .filter(function(i) {
            return i.InstanceId == instance.instanceId;
          });

          var tags = _(ec2Instance)
          .pluck("Tags")
          .flatten()
          .filter(function (tag) {
            return tag.Key == "Project"
            || tag.Key == "Name"
            || tag.Key == "Owner";
          })
          .value();

          instance.tags = [];
          _.each(tags, function(tag) {
            instance.tags[tag.Key] = tag.Value;
          });

          return instance;
        });

        callback(null, instances);
      }
    });
  }
  else {
    // region has no instances with attached volumes
    callback();
  }
}

exports.handler = function(event, context) {

  (new AWS.EC2()).describeRegions({}, function(err, data) {
    if (err) {
      context.fail(err);
    }
    else {
      var regions = data.Regions.map(function(region) {
        return region.RegionName;
      });

      async.map(regions, getAttachedVolumesByRegion, function(err, regions) {
        if (err) {
          context.fail(err);
        }
        else {
          async.map(regions, getInstanceTagsForVolumeByRegion,
            function(err, volumes) {
              if (err) {
                context.fail(err);
              }
              else {
                async.each(_(volumes).compact().flatten().value(),
                copyInstanceTags, function(err) {
                  if (err) {
                    context.fail(err);
                  }
                  else {
                    context.succeed("All required instance tags have been applied.");
                  }
                });
              }
            });
          }
        });
      }
    });
  }

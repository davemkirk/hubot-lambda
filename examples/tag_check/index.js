var AWS = require('aws-sdk');
var async = require('async');
var _ = require('lodash');

exports.handler = function(event, context){

  var regions = [
    "us-east-1",
    "us-west-1",
    "us-west-2",
    "eu-west-1",
    "eu-central-1",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-northeast-1",
    "sa-east-1"
    ];

  var requiredTags = ['Project', 'Name', 'Owner'];
  var untaggedInstances = [];

  async.each(regions, function(r,cb){

    var ec2 = new AWS.EC2({region:r});
    ec2.describeInstances({}, function(err, data){

        if(err){
          cb(err);
        } else {

          //select instances
          var instances = _.map(data.Reservations, function(reservation){ return reservation.Instances; });
          instances = _.flatten(instances);

          //Filter to instances missing requiredTags
          var filtered = 
          _.filter(instances, function(instance){ 
            var tagKeys = _.map(instance.Tags, function(tag){ return tag.Key; } );
            for(var k = 0; k < requiredTags.length; k++){
              if(!_.includes(tagKeys, requiredTags[k])){
                return true;
              }
            }
            return false;
          });

          //append results to the array of all untagged instances
          untaggedInstances = untaggedInstances.concat(filtered);

          cb();
        }
    });

  
  }, function(err){
    if(err){
      console.log(err, err.stack); // an error occurred
    } else {

      //build reponse message
      var message = '';
      message = ':sadpanda: Untagged instances discovered:\n';
      message += '```';
      for(var i = 0; i < untaggedInstances.length; i++){
        var inst = untaggedInstances[i];
        message += _.padRight(inst.Placement.AvailabilityZone, 16) + '\t' + inst.InstanceId + ' (' + inst.State.Name + ')\t[';
        var tags = _.map(inst.Tags, function(tag){ return tag.Key + ':' + tag.Value; });
        message += tags.join('; ') + ']\n';
      }
      message += '```';

      context.succeed(message);
    }
  });

}

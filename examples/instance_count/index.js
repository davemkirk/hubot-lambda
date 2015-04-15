var AWS = require('aws-sdk');

// Set your region for future requests.
AWS.config.region = 'us-east-1';

exports.handler = function(event, context){

  var ec2 = new AWS.EC2();

  // I use describeInstanceStatus here instead of describeInstance because
  // it seems about twice as fast in my cursory testing.
  ec2.describeInstanceStatus({'IncludeAllInstances':false}, function(err, data) {
    if (err){
      console.log(err, err.stack); // an error occurred
    }else{
      var message = "running instance count = " + data.InstanceStatuses.length;
      context.succeed(message);
    }
  });

}

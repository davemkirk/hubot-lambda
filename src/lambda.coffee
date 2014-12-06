# Description:
#   Invokes an AWS Lambda function

accessKeyId = process.env.HUBOT_LAMBDA_AWS_ACCESS_KEY_ID
secretAccessKey = process.env.HUBOT_LAMBDA_AWS_SECRET_ACCESS_KEY 

AWS = require("aws-sdk")

lambda = new AWS.Lambda(
  apiVersion: "2014-11-11"
  accessKeyId: accessKeyId
  secretAccessKey: secretAccessKey
  region: "us-east-1"
  sslEnabled: true
)

module.exports = (robot) ->
  robot.respond /lambda (.*)\s(.*)/i, (msg) ->

    func = msg.match[1]
    arg1 = msg.match[2]

    params =
      FunctionName: func
      InvokeArgs: JSON.stringify(
        arg1: arg1
      )

    lambda.invokeAsync params, (err, data) ->

      if err # an error occurred
        console.log err, err.stack
        msg.send err

      else # successful response
        msg.send "Yo"
        console.log data

      return


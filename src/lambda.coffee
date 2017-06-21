# Description:
#   Invokes an AWS Lambda function
#
# Commands:
#   hubot lambda <function> <args>
#
# Notes:
#
# Author:
#   davemkirk@gmail.com

region = process.env.HUBOT_LAMBDA_REGION ? "us-east-1"
accessKeyId = process.env.HUBOT_LAMBDA_AWS_ACCESS_KEY_ID
secretAccessKey = process.env.HUBOT_LAMBDA_AWS_SECRET_ACCESS_KEY

AWS = require("aws-sdk")
lambda = new AWS.Lambda(
  apiVersion: "2015-03-31"
  accessKeyId: accessKeyId
  secretAccessKey: secretAccessKey
  region: region
  sslEnabled: true
)

module.exports = (robot) ->

  robot.respond /lambda ([a-zA-Z0-9-]+)\s?(.*)/i, (msg) ->

    func = msg.match[1]
    arg1 = msg.match[2]

    payload = JSON.stringify(message: arg1)

    params =
      FunctionName: func
      InvocationType: 'RequestResponse'
      LogType: 'None'
      Payload: payload

    lambda.invoke(
      params
    ).on("success", (response) ->

      payload = JSON.parse(response.data.Payload)
      msg.send payload
      #console.log(response.data.StatusCode, response.data.Payload)

    ).on("error", (response) ->
      msg.send "error: " + response

    ).send()


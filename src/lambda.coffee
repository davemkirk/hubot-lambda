# Description:
#   Invokes an AWS Lambda function
#
# Commands:
#   hubot lambda <function> <arg:value> <arg2:value> - Invokes an AWS lambda function with the given args
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
    args = msg.match[2]

    parsed_args = {}
    args.replace /(\b[^:]+):([^\s]+)/g, ($0, param, value) ->
      parsed_args[param] = value
      return

    payload = JSON.stringify(parsed_args)

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


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
        callbackId: 0
        arg1: arg1
      )

    lambda.invokeAsync(
      params
    ).on("success", (response) ->
        msg.send "Your lambda invocation was accepted (requestId: " + response.requestId + ")"
        return

    ).on("error", (response) ->
        #console.log "error: " + response
        msg.send "error: " + response
        return

    ).send()
    return


  robot.router.post '/lambda/:callbackid', (req, res) ->
    
    callbackid = req.params.callbackid
    room = "Shell" #brain.callbackid.room

    robot.emit "lambdaCallback", {
        callbackid  : callbackid,
        room        : room,
        msg         : res.body
    }


  robot.on "lambdaCallback", (callback) ->
    robot.send callback.room, "callbackid #{callback.callbackid} called back!"





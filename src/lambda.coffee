# Description:
#   Invokes an AWS Lambda function

botUrl = process.env.HUBOT_LAMBDA_BOTURL
region = process.env.HUBOT_LAMBDA_REGION ? "us-east-1"
accessKeyId = process.env.HUBOT_LAMBDA_AWS_ACCESS_KEY_ID
secretAccessKey = process.env.HUBOT_LAMBDA_AWS_SECRET_ACCESS_KEY 

AWS = require("aws-sdk")

lambda = new AWS.Lambda(
  apiVersion: "2014-11-11"
  accessKeyId: accessKeyId
  secretAccessKey: secretAccessKey
  region: region
  sslEnabled: true
)


module.exports = (robot) ->

  robot.brain.lambda =
      invocations: {}

  robot.respond /lambda (.*)\s(.*)/i, (msg) ->

    room = msg.message.room
    func = msg.match[1]
    arg1 = msg.match[2]

    params =
      FunctionName: func
      InvokeArgs: JSON.stringify(
        callbackId: 0
        botUrl: botUrl
        message: arg1
      )

    lambda.invokeAsync(
      params
    ).on("success", (response) ->

        robot.brain.lambda.invocations[response.requestId] = 
            room: room

        console.log JSON.stringify robot.brain.lambda

        msg.send "Your lambda invocation was accepted (requestId: " + response.requestId + ")"
        return

    ).on("error", (response) ->
        msg.send "error: " + response
        return

    ).send()
    return


  robot.router.post '/lambda/:callbackid', (req, res) ->
    
    callbackid = req.params.callbackid

    invocationInfo = robot.brain.lambda.invocations[callbackid]

    if invocationInfo
      delete robot.brain.lambda.invocations[callbackid]

      msg = req.body.msg
      room = invocationInfo.room

      robot.emit "lambdaCallback", {
          callbackid  : callbackid,
          room        : room,
          msg         : msg
      }

    res.end()


  robot.on "lambdaCallback", (callback) ->
    robot.messageRoom callback.room, callback.msg






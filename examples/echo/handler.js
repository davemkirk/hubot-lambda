var request = require("request");

exports.handler = function(event, context) {
    
    var invokeid    = context.invokeid,
        message     = event.message
        botUrl      = event.botUrl;


    if(message == null || botUrl == null){
        console.log("ERROR: expected input missing \n" + JSON.stringify(event));
        context.done(null);
        return;
    }

    botCallback(botUrl, invokeid, message, function(){ context.done(null); });
};

function botCallback(botUrl, invokeid, message, cb){
    
    var callbackurl = botUrl + invokeid + '/'

    console.log("callbackurl: " + callbackurl);

    request.post({url:callbackurl,form:{"msg":message}}, 
        function(error, response, body){ cb(); }
    );
}

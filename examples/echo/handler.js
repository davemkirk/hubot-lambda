
exports.handler = function(event, context) {
    
    var message = event.message;
    console.log(message);

    if(message == null){
        console.log("ERROR: expected input missing \n" + JSON.stringify(event));
        context.done(null);
        return;
    }

    context.succeed(message);  // Echo back the message
};


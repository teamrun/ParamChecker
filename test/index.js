var request = require('request');

var resStr = 'Hello, koa param checker';

function sendReq(){
    request.get({
        url: 'http://localhost:4040/9527',
        qs: {
            index: 1,
            complete: false
        }
    },function(err, resp, body){
        if(err){
            console.log(err);
            return;
        }
        console.log( body === resStr);
        console.log( body );
    })
}

setTimeout(function(){
    sendReq()
}, 2000);
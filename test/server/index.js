var app = require('koa')();
var bodyParse = require('koa-better-body');

var ParamChecker = require('../../');
var Binder = ParamChecker.Binder;
var Checker = ParamChecker.Checker;

Binder(app);
// console.log(ParamChecker);

app.use(function*(){
    console.log('next middlewear');
})


var port = 4040;
app.listen(port, function(){
    console.log('app is listening at', port);
});

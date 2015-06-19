var app = require('koa')();
var router = require('koa-router');
var bodyParse = require('koa-better-body');

var ParamChecker = require('../');
var Binder = ParamChecker.Binder;
var Checker = ParamChecker.Checker;

app.use(router(app));
app.use(bodyParse());

var resStr = 'Hello, koa param checker';
Binder(app, {
    url: '/:id',
    action: 'get',
    param: Checker()
        .requires('id', 'string', 'url')
        .requires('index', 'number', 'query')
        .requires('complete', 'boolean', 'query'),
    handler: function*(next){
        this.body = resStr;
        // console.log(this);
        // yield next;
    }
});

app.use(function*(){
    console.log('next middlewear');
})


var port = 4040;
app.listen(port, function(){
    console.log('app is listening at', port);
});
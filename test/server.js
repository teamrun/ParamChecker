var app = require('koa')();
var router = require('koa-router');
var bodyParse = require('koa-better-body');

var ParamChecker = require('../');
var Binder = ParamChecker.Binder;
var Checker = ParamChecker.Checker;

app.use(router(app));

var resStr = 'Hello, koa param checker';
Binder(app, {
    url: '/url/query/:id',
    action: 'get',
    param: Checker()
        .requires('id', 'string', 'url')
        .requires('index', 'number', 'query')
        .requires('complete', 'boolean', 'query'),
    handler: function*(next){
        console.log('cp of', this.path, this.cp);
        this.body = resStr;
        // yield next;
    }
});

Binder(app, {
    url: '/body/encoded',
    action: 'post',
    md: bodyParse(),
    param: Checker()
        .requires('name', 'string', 'body')
        .requires('password', 'string', 'body'),
    handler: function*(next){
        console.log('cp of', this.path, this.cp);
        this.body = resStr;
        // yield next;
    }
});

// app.post('/body', bodyParse(), function*(){
//     console.log(this.request.body);
//     this.body = resStr;
// });

app.use(function*(){
    console.log('next middlewear');
})


var port = 4040;
app.listen(port, function(){
    console.log('app is listening at', port);
});
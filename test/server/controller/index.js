var bodyParse = require('koa-better-body');

var ParamChecker = require('../../../');
var constVars = require('../../const');

var Checker = ParamChecker.Checker;
var resStr = 'Hello, koa param checker';

module.exports.controllers = [
    {
        url: '/url/query/:id',
        action: 'get',
        param: Checker()
            .requires('id', 'string', 'url')
            .requires('index', 'number', 'query')
            .requires('complete', 'boolean', 'query'),
        handler: function*(next){
            console.log('cp of', this.path, this.cp);
            this.body = constVars.resStr;
            // yield next;
        }
    },
    {
        url: '/body/encoded',
        action: 'post',
        md: bodyParse(),
        param: Checker()
            .requires('username', 'string', 'body')
            .requires('password', 'string', 'body'),
        handler: function*(next){
            console.log('cp of', this.path, this.cp);
            this.body = constVars.resStr;
            // yield next;
        }
    },
    {
        url: '/body/has_url_p/:id',
        action: 'post',
        md: bodyParse(),
        param: Checker()
            .requires('id', 'string')
            .requires('username', 'string')
            .requires('password', 'string'),
        handler: function*(next){
            console.log('cp of', this.path, this.cp);
            this.body = this.cp;
        }
    },
    {
        url: '/no-param-define',
        action: 'get',
        handler: function*(){
            this.body = constVars.noChecker;
        }
    }
]

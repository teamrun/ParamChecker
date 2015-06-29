var bodyParse = require('koa-better-body');
var ParamChecker = require('../../../../');

var constVars = require('../../../const');

var Checker = ParamChecker.Checker;

module.exports.controllers = [
    {
        url: '/encoded',
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
        url: '/has_url_p/:id',
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
    }
];

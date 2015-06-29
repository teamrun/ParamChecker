var ParamChecker = require('../../../');
var constVars = require('../../const');

var Checker = ParamChecker.Checker;

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
        url: '/no-param-define',
        action: 'get',
        handler: function*(){
            this.body = constVars.noChecker;
        }
    },
    // {
    //     url: undefined,
    //     action: 'get'
    // }
]

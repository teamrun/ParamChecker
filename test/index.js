global.expect = require('expect.js');
global.request = require('request');
global.co = require('co');
global.thunkify = require('thunkify');

global.constVars = require('./const');
var baseUrl = 'http://localhost:4040';

function req(action, params, callback){
    // 只传一个url的情况
    if(typeof params == 'string'){
        params ={
            url: baseUrl + params.url
        }
    }
    else{
        params.url = baseUrl + params.url;
    }

    request[action](params, callback);
}

global.req = thunkify(req);

var emptyF = function(){};

// 弃用coit, 因为co会在异步完成的调用then/catch中一直catch错误
// 导致不能实现expect的抛错, 达不到expect/assert的作用
// 换用thunkify的req, 参数为 请求成功时的callback, 在callback里面做expect
global.reqit = function(desc, reqF, sucF){
    sucF = sucF || emptyF;
    it(desc, function(done){
        reqF(function(err, resp, body){
            if(!err){
                sucF(resp, body);
            }
            else{
                console.log('请求出错!');
                expect(err).to.be(null);
            }
            done();
        })
    })
};


require('./spec/url-query-body');
require('./spec/binder');

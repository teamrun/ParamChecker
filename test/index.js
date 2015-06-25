global.expect = require('expect.js');
global.request = require('request');
global.co = require('co');
global.thunkify = require('thunkify');

global.resStr = 'Hello, koa param checker';
var baseUrl = 'http://localhost:4040';

function req(action, params, callback){
    params.url = baseUrl + params.url;
    request[action](params, callback);
}

global.req = thunkify(req);

var emptyF = function(){};
global.coit = function(desc, gen, thenF, catchF){
    thenF = thenF || emptyF;
    catchF = catchF || emptyF;
    it(desc, function(done){
        co(gen)
            .then(function(){
                thenF.apply(this, arguments);
                done();
            })
            .catch(function(e){
                catchF(e);
                expect(e);
                done();
            })
    })
};


require('./spec/url-query-body');
var path = require('path');
var Router = require('koa-router');
var ScanBind = require('./scan-bind');

var pcRouter = new Router();

module.exports = function(app){
    ScanBind(app, pcRouter, {
        basePath: path.dirname(process.mainModule.filename),
        controllerPath: 'controller'
    });
}

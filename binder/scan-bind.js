var path = require('path');
var glob = require('glob');

function bindToRouter(router, opt){
    var url = opt.url, action = opt.action, handler = opt.handler;
    var md = opt.md;
    var checker = opt.param;

    // 为方便绑定多个路由, 将绑定的参数做成arr
    var bindArgs = [function*(next){
        var checkRet = yield checker.check(this, next);
        // 检查通过后才执行handler
        if(checkRet){
            yield handler.call(this, next);
        }
        // 不通过就走next
        else{
            yield next;
        }
    }];
    // 存在额外的中间件
    // todo: 判断中间件是否是Generator? 还是交由router判断?
    if(md){
        bindArgs.unshift(md);
    }
    bindArgs.unshift(url);
    router[action].apply(router, bindArgs)
}

function bindToApp(app, router){
    app.use(router.routes());
}

function scanAndBind(folderAbspath, basePath, router){
    var files = glob.sync(folderAbspath + '/**/*.+(js|coffee)');
    files.forEach(function(f){
        var _module = require(f);
        // 如果有controllers
        if(_module.controllers){
            _module.controllers.forEach(function(ctrlOpt){
                bindToRouter(router, ctrlOpt);
            });
        }
    })
}

module.exports = function(app, router, opt){
    var folderPath = path.join(opt.basePath, opt.controllerPath || 'controller');
    scanAndBind(folderPath, opt.basePath, router);
    bindToApp(app, router);
}

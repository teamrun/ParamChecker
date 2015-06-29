var path = require('path');
var util = require('util');
var glob = require('glob');

function bindToRouter(router, opt){
    var url = opt.url, action = opt.action, handler = opt.handler;
    var md = opt.md;
    var checker = opt.param;
    // action校验: 没有 就跳过
    // http method类型...
    if(!action){
        return;
    }

    // 为方便绑定多个路由, 将绑定的参数做成arr
    var bindArgs = [];
    // 真正的请求处理函数 参数校验+handler
    var reqHandler;
    // 存在checker, 生成一个先check再handler的generator函数
    if(checker){
        reqHandler = function*(next){
            var checkRet = yield checker.check(this, next);
            // 检查通过后才执行handler
            if(checkRet){
                yield handler.call(this, next);
            }
            // 不通过就走next
            else{
                yield next;
            }
        }
    }
    else{
        reqHandler = handler;
    }
    bindArgs.unshift(reqHandler);

    // 存在额外的中间件
    // todo: 判断中间件是否是Generator? 还是交由router判断?
    if(md){
        bindArgs.unshift(md);
    }
    bindArgs.unshift(url);
    // router.get(url, handler[, handler2, handler3]);
    router[action].apply(router, bindArgs)
}

function bindToApp(app, router){
    app.use(router.routes());
}

function urlProcessor(routeUrl, filePath, controllerFolderPath){
    var fPath = filePath, cPath = controllerFolderPath;
    if(routeUrl instanceof RegExp){
        return routeUrl;
    }
    else if(typeof routeUrl == 'string'){
        // 扫描的文件 相对于 controller文件夹的路径
        var relativeToCtrlFolder = path.relative(controllerFolderPath, fPath);
        var r = relativeToCtrlFolder;
        // 取目录路径
        var pathName = path.dirname(r);
        var fileName = path.basename(r, path.extname(r));
        var urlPrefix = '';
        // controller下的直属一层 相对路径是.
        if(pathName === '.'){
            urlPrefix = '';
        }
        else{
            urlPrefix = '/' + pathName
        }
        // index.js 不用再加一层
        if(fileName === 'index'){ }
        else{
            urlPrefix += '/' + fileName;
        }
        return urlPrefix + routeUrl;
    }
    else{
        return routeUrl;
    }
}

function scanAndBind(folderAbspath, router){
    var files = glob.sync(folderAbspath + '/**/*.+(js|coffee)');
    files.forEach(function(f){
        var _module = require(f);
        // 如果有controllers
        if(_module.controllers){
            _module.controllers.forEach(function(ctrlOpt){
                ctrlOpt.url = urlProcessor(ctrlOpt.url, f, folderAbspath);
                // console.log(ctrlOpt.url);
                bindToRouter(router, ctrlOpt);
            });
        }
    })
}

module.exports = function(app, router, opt){
    var folderPath = path.join(opt.basePath, opt.controllerPath || 'controller');
    scanAndBind(folderPath, router);
    bindToApp(app, router);
}

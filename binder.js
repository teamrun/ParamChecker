function binder(app, opt){
    var url = opt.url, action = opt.action, handler = opt.handler;
    var md = opt.md;
    var checker = opt.param;

    // 为方便绑定多个路由, 将绑定的参数做成arr
    var bindArgs = [function*(next){
        var checkRet = yield checker.check(this, next);
        // 检查通过后才执行handler
        if(checkRet){
            // console.log('check pass');
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
    app[action].apply(app, bindArgs)
}

module.exports = binder;
function binder(app, opt){
    var url = opt.url, action = opt.action, handler = opt.handler;
    var checker = opt.param;

    app[action](url, function*(next){
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
    });
}

module.exports = binder;
var util = require('util');


// 获取参数的方法
var get_f = require('./getValue');
var check_type_f = require('./checkType');

String.prototype.capitalize = function(){
    return this.slice(0,1).toUpperCase() + this.slice(1);
}

// 获取参数
// 综合起来的验证方法
//      类型是否正确
//      是否在枚举之中
//      是否满足传来的validator方法
function genCheckFunc(getF, validatorF){
    return function(ctx){
        var value = getF.call(ctx);
        // log.debug(value);
        return validatorF(value);
    }
}

var Checker = function(){
    this.paramSetting = [];
    // 各个参数的校验的方法
    this.checkFuncs = [];
    // 根据参数的限制 生成doc
    this.docInfo = [];
    return this;
}
Checker.prototype.requires = function(name, type, _from, opt){
    this.paramSetting.push({
        name: name,
        type: type,
        from: _from,
        opt: opt
    });

    return this;
}
Checker.prototype.check = function* (ctx, next){
    var errMsgs = [];
    var checkedParam = {};
    var confs = this.paramSetting;
    
    // 取参数 -> 校验类型 -> 复杂校验(reg, enum, contains等)
    confs.forEach(function(conf){
        var paramName = conf.name, requiredType = conf.type, _from = conf.from;
        var getFn;
        switch(true){
            case (_from == 'body' || _from == 'query' || _from == 'url'):
                var getFnName = 'from'+_from.capitalize();
                console.log(util.format('get %s from %s by %s', paramName, _from,  getFnName));
                getFn = get_f[getFnName];
                break;
            default:
                getFn = get_f._default;
        }
        var paramVal = getFn.apply(ctx, [paramName]);
        var ret = check_type_f(paramVal, requiredType);

        if(ret.err){
            errMsgs.push( util.format('param error: %s,  %s', name, ret.err) );
        }
        else{
            checkedParam[paramName] = ret.data;
        }
    });
    

    if(errMsgs.length > 0){
        ctx.body = {
            code: 300,
            msg: errMsgs.join(';')
        }
        return false;
    }
    ctx.cp = checkedParam;
    return true;
}

// 根据规则生成api文档说明
Checker.prototype.getDoc = function(ctx){
}


module.exports = function(){
    return new Checker();
}





// requires, optional 等等 都是最终要生成 针对一个参数的完整的校验函数
// ~~so, 高阶函数~~ 高阶函数太复杂 先用简单的存配置的方式实现吧

// 最好只需要一次生成, 而不是每次请求来了在生成&处理
// so, 最好是在handler外面

// 要能拦截请求, 自己做完返回(参数有错误, 返回错误提示)
// so, 要能控制handler执行与否

// 最好的,易于实施的方案:
// 一个负责绑定路由的函数, 接收: url, action, checker setting, handler
// 给这个url绑定上的函数是这样的:
// app[action](url, function*(){
//     var res = generatedCheckFunc(this);
//     if(res.error){
//         this.body = res.msg;
//     }
//     else{
//         yield handler.call(this, next);
//     }
// })


// 当然, 可以根据框架的不同做不同的处理, 比如kao依赖的是ctx, 而express依赖的是req, res

// 更加完善的功能: get的参数不能从body里面取, url中没有:param的不能从url里面取

// 可结合性: 通过这个生成doc
// rainbow做的是 处理函数代码扫描 和 url拼接, 这个方法完全可以和rainbow结合:
//      rainbow负责拿出url和action, 还有handler
//      交由checker来绑定路由
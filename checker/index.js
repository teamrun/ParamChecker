var util = require('util');


// 获取参数的方法
var get_f = require('./getValue');
var type_f = require('./checkType');

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
Checker.prototype.requires = function(name, type, from, opt){
    this.paramSetting.push({
        name: name,
        type: type,
        opt: opt
    });

    var getFunc, validateFunc;
    // 获取参数
    switch(true){
        case (from == 'body' || from == 'query' || from == 'url'):
            var getFnName = 'from'+from.capitalize();
            // console.log(util.format('get %s from %s by %s', name, from,  getFnName));
            getFunc = get_f[getFnName](name);
            break;
        default:
            getFunc = get_f._default(name);
    }

    // 根据类型进行校验
    // 稍后再考虑用户自定义校验
    validateFunc = function(value){
        var requiredType = type;
        return type_f(value, requiredType);
    }

    var checkerOfThisParam = genCheckFunc(getFunc, validateFunc);
    this.checkFuncs.push(checkerOfThisParam);

    return this;
}
Checker.prototype.check = function* (ctx, next){
    var errMsgs = [];
    var checkedParam = {};
    var sti = this.paramSetting;
    this.checkFuncs.forEach(function(f, i){
        // 既然name可以读, 
        // 那么其他设置也可以读
        // 也可以把"生成function"的方式调整一下吧?
        var name = sti[i].name;
        // console.log('checking:', name);
        var ret = f(ctx);
        if(ret.err){
            errMsgs.push( util.format('param error: %s,  %s', name, ret.err) );
        }
        else{
            checkedParam[name] = ret.data;
        }
        // console.log('done:', name);
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
// so, 高阶函数

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
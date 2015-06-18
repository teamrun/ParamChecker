var util = require('util');

function getType(value){
    // string 可能是字符串, 也可能是数组
    var type = typeof value;
    if(type == 'string'){
        return 'string';
    }
    else if(type == 'object'){
        if(Array.isArray(value)){
            return 'array';
        }
        else if(value !== null){
            return 'object'
        }
        else{
            return null;
        }
    }
    else{
        return 'undefiend'
    }
}


function checkType(value, requiredType){
    var valueType = getType(value);
    var wrongTypeErrMsg = util.format('required %s but got %s', requiredType, valueType);
    // 类型很匹配, 那就直接拿去用
    if(requiredType === valueType){
        return {
            err: null, 
            data: value
        };
    }
    // 类型不匹配, 但是由于http是纯文本协议
    // 总会有一些类型转换, 试着往回转化一下
    // string: 可能是number 或者 boolean
    else{
        // 数字类型
        if(requiredType === 'number' && valueType === 'string'){
            // 空串 返回错误, 不能被合法的转化为数字类型(会默认转为0)
            if(value.trim() === ''){
                return {
                    err: wrongTypeErrMsg
                }
            }
            else{
                var nValue = Number(value);
                if(!Number.isNaN(nValue)){
                    return {
                        err: null,
                        data: nValue
                    };
                }
            }
        }

        // boolean类型
        if(requiredType === 'boolean' && valueType === 'string'){
            if(value === 'true'){
                return {err: null, data: true}
            }
            else if(value === 'false'){
                return {err: null, data: false}
            }
        }

        // 几种可能被http妥协掉的类型都匹配不上, 就报错
        return {
            err: wrongTypeErrMsg
        }
    }
}
module.exports = checkType;
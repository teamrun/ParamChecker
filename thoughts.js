
// 方案: 通过函数实现doc和param检测
// 实现: 工厂函数, 同一个url绑定两个路由, 先检查参数, 通过就next(), 
//      不通过就res.send({code: 300, error: 'msg'})
//      具体的函数还要再写, 还是蛮麻烦的
//      而且同一套规则, 前端后端解析都可以用同一个方法, api试用 参数提交前的检查

// 必填 
//      类型, 范围/enum枚举
//          不符合就直接返回code: 300, error: 'p1, p2不能为空'
//      from: url / query / body, 如果不传的话就直接req.param('p_name')了
//          传了就用特定大方法取
// 选填, 类型, 范围/枚举
//      如果不符合 就这个参数忽略, 同时在返回中添加warn消息, 告知这个参数没有存起来

'/sub-path': {
    get: {
        desc: '接口说明',
        param: gen.required('token')
                    // 必须
                    .required('order_id')
                    // 必须, 而且只能从候选值中取
                    .required('action', {
                        enum:{
                            agree: '同意',
                            decline: '拒绝'
                        }
                    })
                    // 非必须
                    .optional('param_optional')
                    .optional('decline_note')
                    // 可选
                    // 如果某个值是某个值, 则必须填
                    .optionalIf('decline_code', {
                        $cdt: {
                            action: {
                                $eq: 'decline'
                            }
                        }
                    }),
        handler: function(req, res){}
    }
}
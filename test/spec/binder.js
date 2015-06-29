describe('binder单元测试', function(){
    reqit('没有param属性的时候, 即没有参数校验, 也能绑定处理函数', req('get', {url: '/no-param-define'}), function(resp, body){
        expect(body).to.be(constVars.noChecker);
    });
});

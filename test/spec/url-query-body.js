describe('first spec', function(){
    coit('能够检查url, query中的参数', function*(){
        var resp = yield req('get', {
            url: '/url/query/123',
            qs: {
                index: 456,
                complete: true
            }
        });
        return resp;
    },function(result){
        expect(result[1]).to.be(resStr);
    });

    coit('能够检查body中的参数: x-www-form-urlencoded', function*(){
        var resp = yield req('post', {
            url: '/body/encoded',
            form: {
                name: 'chenllos',
                password: 'sasuke'
            }
        });
        return resp;
    },function(result){
        expect(result[1]).to.be(resStr);
    });
});
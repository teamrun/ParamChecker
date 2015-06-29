describe('first spec', function(){
    reqit('能够检查url, query中的参数',req('get', {
            url: '/url/query/123',
            qs: {
                index: 456,
                complete: true
            }
        }), function(resp, body){
            expect(body).to.be(constVars.resStr);
        });

    reqit('能够检查body中的参数: x-www-form-urlencoded',  req('post', {
            url: '/body/encoded',
            form: {
                username: 'chenllos',
                password: 'sasuke'
            }
        }),function(resp, body){
            expect(body).to.be(constVars.resStr);
        });

    reqit('如果不指定from, 就会url-query-body的顺序取',  req('post', {
            url: '/body/has_url_p/url_id',
            qs: {
                id: 'query_id',
                username: 'query_name'
            },
            form: {
                id: 'body_id',
                username: 'body_name',
                password: 'body_pass'
            }
        }), function(resp, body){
            var data = JSON.parse(body);
            expect(data.id).to.be('url_id');
            expect(data.username).to.be('query_name');
            expect(data.password).to.be('body_pass');
        });
});

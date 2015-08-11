// koa版本的取参数方法
// koa依赖于context, 所以要保证去参数的context要正确

// requires: koa-router, koa-better-body
var GET_FUNC = {
    fromUrl: function(key){
        // console.log(this);
        return this.params[key];
    },
    fromQuery: function(key){
        return this.query[key];
    },
    fromBody: function(key){
        return this.request.body.fields[key];
    },
    _default: function(key){
        // console.log('key: ', key);
        // console.log(this.params[key]);
        // console.log(this.query[key]);
        // console.log(this.request.body.fields[key]);
        return this.params[key] ||  this.query[key] || this.request.body.fields[key];
    }
}

module.exports = GET_FUNC;

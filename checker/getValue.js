// requires: koa-router, koa-better-body
var GET_FUNC = {
    fromUrl: function(key){
        return function(){
            return this.params[key];
        }
    },
    fromQuery: function(key){
        return function(){
            return this.query[key];
        }
    },
    fromBody: function(key){
        return function(){
            return this.request.body.fields[key];
        }
    },
    _default: function(key){
        return function(){
            // console.log('key: ', key);
            // console.log(this.params[key]);
            // console.log(this.query[key]);
            // console.log(this.request.body.fields[key]);
            return this.params[key] ||  this.query[key] || this.request.body.fields[key];
        }
    }
}

module.exports = GET_FUNC;

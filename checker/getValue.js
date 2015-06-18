// requires: koa-router, koa-better-body
var GET_FUNC = {
    fromUrl: function(key){
        return function(key){
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
            log.debug(this.request.body);
            return this.request.body.fields[key];
        }
    },
    _default: function(key){
        return function(){
            return this.params[key] ||  this.params[key] || this.request.body.fields[key];
        }
    }
}

module.exports = GET_FUNC;
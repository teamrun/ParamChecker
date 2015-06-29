var allowedMehods = ['get', 'post', 'put', 'delete', 'patch', 'options'];

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

module.exports = function(routeObj){
    var url = routeObj.url, method = routeObj.action, md = routeObj.md, handler = routeObj.handler;

    var problems = [];

    if(!(url instanceof RegExp || typeof url === 'string')){
        problems.push('typeof url should be RegExp or String');
    }

    if(!method || allowedMehods.indexOf(method.toLowerCase()) < 0){
        problems.push('method can not be one of these: '+allowedMehods.join(', '));
    }

    var hasMd = false;
    if(md){
        if(isGeneratorFunction(md)){
            hasMd = true;
        }
        else{
            problems.push('md should be a GeneratorFunction');
        }
    }
    else{
        hasMd = false;
    }

    if(handler){
        if(!isGeneratorFunction(handler)){
            problems.push('handler should be a GeneratorFunction');
        }
    }
    else{
        if(hasMd === false){
            problems.push('md or handler, at least one should be not null');
        }
    }

    return (problems.length === 0)? true : problems;
}

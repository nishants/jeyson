module.exports = {
  link: function(scope, template, params, compile, readFile){
    var includes = readFile(params);
    for(var field in includes){
      template[field] = includes[field];
    }
    return compile(scope, template);
  }
};
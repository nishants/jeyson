module.exports = {
  link: function(scope, template, params, compile, readFile){
    var includeTemplate = JSON.parse(readFile(params));
    for(var field in includeTemplate){
      template[field] = includeTemplate[field];
    }
    return template;
  }
};
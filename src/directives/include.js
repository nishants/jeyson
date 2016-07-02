var extend = require("extend");

module.exports = {
  link: function(scope, template, params, compile, getTemplate){
    var includes = compile(scope, getTemplate(params)),
        result   = template.copy();

    extend(true, result, includes);

    return compile(scope, result);
  }
};
var extend = require("extend");

module.exports = {
  link: function(scope, template, params, compile, getTemplate){
    var includes = compile(scope, getTemplate(params));
    extend(true,
        template,
        includes);
  }
};
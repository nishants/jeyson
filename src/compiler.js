var linker = require("./linker"),
    scopes = require("./scope"),
    templates = require("./templates"),
    directives = require("./directives");

module.exports = {
  $compile: function (scope, template, config) {
    return this.compile(scopes.create(scope), template, config);
  },
  compile: function (scope, template, config) {
    var result = {},
        self = this,
        compile = function(scope, template){
          return self.compile(scope, templates.copy(template), config);
        },
        getTemplate = function(path){
          return JSON.parse(config.getTemplate(path));
        };

    config = config ? config : {};

    if(templates.isDirective(template)) {
      return directives.link(scope, template, compile, getTemplate);
    }

    for(var node in template){
          var value       = template[node],
              isSubtree   = (typeof value == "object") && !(Array.isArray(value));

          result[node] = isSubtree ? self.compile(scope, value, config) : linker.link(scope, value);
    }
    return result;
  }
};
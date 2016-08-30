var linker = require("./linker"),
    scopes = require("./scope"),
    templates = require("./templates"),
    directives = require("./directives");

module.exports = {
  $compile: function (scope, template, config) {
    return this.compile(scopes.create(scope), template, config ? config : {});
  },
  compile: function (scope, template, config) {
    var self = this,
        compile = function(scope, template){
          return self.compile(scope, templates.copy(template), config);
        },
        getTemplate = function(path){
          return JSON.parse(config.getTemplate(path));
        };

    if(templates.isDirective(template)) {
      return directives.link(scope, template, compile, getTemplate);
    }

    if(templates.isList(template)) {
      return template.map(function(element){
        return compile(scope, element, config);
      });
    }

    if(templates.isSubtree(template)){
      var result = {};
      for(var node in template){
        result[node] = compile(scope, template[node], config);
      }
      return result;
    }

    return linker.link(scope, template);
  }
};
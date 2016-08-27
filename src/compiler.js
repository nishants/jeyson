var linker = require("./linker"),
    scopes = require("./scope"),
    templates = require("./templates"),
    directives = require("./directives");

module.exports = {
  $compile: function (scope, template, config) {
    return this.compile(scopes.create(scope), template, config ? config : {});
  },
  compile: function (scope, template, config) {
    var result = {},
        self = this,
        compile = function(scope, template){
          return self.compile(scope, templates.copy(template), config);
        },
        getTemplate = function(path){
          return JSON.parse(config.getTemplate(path));
        },
        compileNode = function(scope, nodeValue){
          if(Array.isArray(nodeValue)){
            return nodeValue.map(function (element){
              return compile(scope, element);
            });
          }
          if(typeof nodeValue == "object"){
            return compile(scope, nodeValue);
          }

          return linker.link(scope, nodeValue);
        };


    if(templates.isDirective(template)) {
      return directives.link(scope, template, compile, getTemplate);
    }

    for(var node in template){
      result[node] = compileNode(scope, template[node]);
    }
    return result;
  }
};
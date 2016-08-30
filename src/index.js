var Directives  = require("./directives"),
    Compiler    = require("./compiler");

module.exports = {
  create: function(){
    var directives  = Directives.create(),
        compiler    = Compiler.create(directives);

    return {
      compile: function(scope, template, config){
        return compiler.$compile(scope, template, config) ;
      },
      directive: function(name, definition){
        return directives.add(name, definition);
      }
    };
  }
};
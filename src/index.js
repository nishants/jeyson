var compiler  = require("./compiler"),
    Directives = require("./directives");

module.exports = {
  compile: function(scope, template, config){
    return compiler.$compile(scope, template, config) ;
  },
  directive: function(name, definition){
    return Directives.add(name, definition);
  },

  create: function(){
    return this;
  }
};
var compiler  = require("./compiler"),
    Directives = require("./directives");

module.exports = {
  compile: function(scope, template){
    return compiler.$compile(scope, template);
  },
  directive: function(name, definition){
    return Directives.add(name, definition);
  },

  create: function(){
    return this;
  }
};
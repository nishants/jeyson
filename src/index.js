var compiler = require("./compiler");

module.exports = {
  compile: function(scope, template){
    return compiler.$compile(scope, template);
  }
};
var fs = require("fs"),
    getTemplate =
        function (path) {
          return JSON.parse(fs.readFileSync(path));
        };

module.exports = {
  plainJson : function(){
    return getTemplate("test/data/plain.json");
  },
  expressionJson : function(){
    return getTemplate("test/data/expression.json");
  }
}
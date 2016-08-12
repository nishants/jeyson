var fs = require("fs"),
    specsPath = "test/data/specs",
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
  },
  specs : function(){
    return fs.readdirSync(specsPath).map(function(specFile){
      return JSON.parse(fs.readFileSync(specsPath +"/" + specFile));
    });
  },
}
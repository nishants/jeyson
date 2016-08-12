var fs = require("fs"),
    getTemplate =
        function (path) {
          return fs.readFileSync(path)
        };

module.exports = {
  getPlainJson : function(){
    return JSON.parse(getTemplate("test/data/plain.json"));
  }
}
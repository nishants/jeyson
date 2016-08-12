var fs = require("fs"),
    specsPath = "test/data/specs",
    getTemplate =
        function (path) {
          return JSON.parse(fs.readFileSync(path));
        };

module.exports = {
  specs : function(){
    return fs.readdirSync(specsPath).filter(function(file){
      return file.endsWith("_spec.json");
    }).map(function(specFile){
      return JSON.parse(fs.readFileSync(specsPath +"/" + specFile));
    });
  },
  getTemplate: function(specFile){
    return fs.readFileSync(specsPath +"/" + specFile);
  }
}
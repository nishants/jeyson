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
      var filename  = specsPath + "/" + specFile,
          spec      = JSON.parse(fs.readFileSync(filename));
      spec.filename = filename;
      return spec;
    });
  },
  getTemplate: function(specFile){
    return fs.readFileSync(specsPath +"/" + specFile);
  }
}
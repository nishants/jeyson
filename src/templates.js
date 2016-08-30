var extend = require("./support/extend");

var Templates = {
  isList: function (template) {
    return Array.isArray(template);
  },
  isSubtree: function (template) {
    return (typeof template == "object") && !Templates.isList(template);
  },
  hasDirective: function (template) {
    for (var field in template) {
      if (field.startsWith("@")) {
        return true;
      }
    }
    return false;
  },
  deleteDirective: function (template, name) {
    delete template[name];
  },
  isIgnored : function(scope, temlpate){
    return !! scope.execute(temlpate["@ignore-if"] || "");
  },
  cleanup  : function(template){
    var     clean = Templates.copy(template);
    delete  clean["@ignore-if"];
    return  clean;
  },
  copy: function (template) {
    if (Templates.isList(template)){
      return template.map(function(element){
        return Templates.copy(element);
      });
    }

    if(Templates.isSubtree(template)){
      var result = {};
      extend(true, result, template);
      return result;
    }

    return template;
  }
};
module.exports = Templates;
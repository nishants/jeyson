var repeater  = require("./directives/repeat"),
    compileIt = require("./directives/compile"),
    include   = require("./directives/include"),
    templates = require("./templates"),
    all = {};

var Directives = {
  all: all,
  get: function (name) {
    return all[name];
  },
  add: function (name, definition) {
    all[name] = {link: definition.link};
  },
  link: function (scope, body, compile, getTemplate) {
    var directive,
        param,
        replaceBody;

    for(var field in body){
      if(field.startsWith("@")){
        directive = {
          name: field,
          directive: all[field]
        }
      }
    };

    param = body[directive.name];
    templates.deleteDirective(body, directive.name)

    // If directive returns body, replace template with returned body
    // Else compile the updated body and return
    return directive.directive.link(scope, body, param, compile, getTemplate) || compile(scope, body);
  }
};
Directives.add("@repeat", {link: repeater.link});
Directives.add("@compile", {link: compileIt.link});
Directives.add("@include", {link: include.link});
module.exports = Directives;

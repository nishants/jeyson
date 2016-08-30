var repeater  = require("./directives/repeat"),
    compileIt = require("./directives/compile"),
    include   = require("./directives/include"),
    ifThenElse= require("./directives/if-else-then"),
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
        directive = directive || {
          name: field,
          directive: all[field]
        }
      }
    };

    //ignore an undefined directive
    if(!directive.directive){
      return body;
    }
    param = body[directive.name];
    templates.deleteDirective(body, directive.name)

    // If directive returns body, replace template with returned body
    // Else compile the updated body and return
    var linked = directive.directive.link(scope, body, param, compile, getTemplate);

    //Avoid undefined, allow null
    return linked === undefined ? compile(scope, body) : linked ;
  }
};
Directives.add("@repeat", {link: repeater.link});
Directives.add("@compile", {link: compileIt.link});
Directives.add("@include", {link: include.link});
Directives.add("@if", {link:      ifThenElse.link});
module.exports = Directives;

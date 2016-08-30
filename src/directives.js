var templates = require("./templates");

var Directives = {
  all: {},
  get: function (name) {
    return all[name];
  },
  add: function (name, definition) {
    Directives.all[name] = {link: definition.link};
  },
  link: function (scope, body, compile, getTemplate) {
    var directive,
        param;

    for(var field in body){
      if(field.startsWith("@")){
        directive = directive || {
          name: field,
          linker: Directives.all[field]
        }
      }
    };

    //ignore an undefined directive
    if(!directive.linker){
      return body;
    }
    param = body[directive.name];
    templates.deleteDirective(body, directive.name)

    // If directive returns body, replace template with returned body
    // Else compile the updated body and return
    var linked = directive.linker.link(scope, body, param, compile, getTemplate);

    //Avoid undefined, allow null
    return linked === undefined ? compile(scope, body) : linked ;
  }
};

Directives.add("@repeat"    , {link: require("./directives/repeat").link});
Directives.add("@compile"   , {link: require("./directives/compile").link});
Directives.add("@include"   , {link: require("./directives/include").link});
Directives.add("@if"        , {link: require("./directives/if-else-then").link});

module.exports = Directives;

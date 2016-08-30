var templates = require("./templates");

module.exports = {
  create: function(){
    var Directives = {
      linkers: {},
      add: function (name, definition) {
        Directives.linkers[name] = {link: definition.link};
      },
      link: function (scope, body, compile, getTemplate) {
        var directive,
            param;

        for(var field in body){
          if(field.startsWith("@")){
            directive = directive || {
                  name: field,
                  linker: Directives.linkers[field]
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

    return Directives;
  }
};

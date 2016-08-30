var Directives          = require("./directives"),
    Compiler            = require("./compiler"),
    Repeater            = require("./directives/repeat"),
    CompileDirective    = require("./directives/compile").link,
    IncludeDirective    = require("./directives/include"),
    IfElseThenDirective = require("./directives/if-else-then");

module.exports = {
  create: function(){
    var directives  = Directives.create(),
        compiler    = Compiler.create(directives);

    directives.add("@repeat"    , {link: Repeater.link});
    directives.add("@compile"   , {link: CompileDirective});
    directives.add("@include"   , {link: IncludeDirective.link});
    directives.add("@if"        , {link: IfElseThenDirective.link});

    return {
      compile: function(scope, template, config){
        return compiler.$compile(scope, template, config) ;
      },
      directive: function(name, definition){
        return directives.add(name, definition);
      }
    };
  }
};
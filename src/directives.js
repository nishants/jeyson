var repeater = require("./directives/repeat"),
    compileD = require("./directives/compile"),
    include = require("./directives/include"),
    all = {};

var Directives = {
  all: all,
  get: function (name) {
    return all[name];
  },
  add: function (name, definition) {
    all[name] = {link: definition.link};
  },
  link: function (scope, template, compile, parse) {
    var directive,
        param;

    for (var field in template) {
      field.startsWith("@") && (directive = {
        name: field,
        directive: all[field]
      });
    }
    param = template[directive.name];
    template.deleteDirective(directive.name)

    var replace = directive.directive.link(scope, template, param, compile, parse);
    template = replace || compile(scope, template); // replace if directive returns valid value, else compile the template after directoryis done
    return template;
  }
};
Directives.add("@repeat", {link: repeater.link});
Directives.add("@compile", {link: compileD.link});
Directives.add("@include", {link: include.link});
module.exports = Directives;

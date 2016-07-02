var linker = require("./linker"),
    scopes = require("./scope"),
    templates = require("./templates"),
    directives = require("./directives");

module.exports = {
  $compile: function (scope, template, config) {
    return this.compile(scopes.create(scope), template, config);
  },
  compile: function (scope, template, config) {
    var result = {},
        self = this,
        compile = function(scope, template){
          return self.compile(scope, template);
        };

    config = config ? config : {};

    //TODO invoke compile through $comiple (always)
    template.__ || (template = templates.create(template));

    if(template.isDirective()) {
      return directives.link(scope, template, compile, config.readFile);
    }

    for (var node in template) {
      var value       = template[node],
          isSubtree   = (typeof value == "object");

      result[node] = isSubtree ? this.compile(scope, value) : linker.link(scope, value);
    }
    return result.render();
  }
};
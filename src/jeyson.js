var
    scopes = {
      create : function(scope){
        var error = function(params){
          var message =  "<error> :  <expression> for <scope>"
              .replace("<expression>", params.expression)
              .replace("<scope>", JSON.stringify(params.scope))
              .replace("<error>", params.error);
          return {
            message: message
          };
            },
        execute = function (scope, expression) {
          var contextScript = "";
          for (var field in scope) {
            contextScript += ("var <field> = this.<field>;".replace("<field>", field).replace("<field>", field));
          }
          scope.execute = function () {
            var escapeExpression = expression.replace(new RegExp("\'", 'g'), "\\'");
            try {
              return eval(contextScript + "eval('<expression>');".replace("<expression>", escapeExpression));
            }catch(err){
              return error({scope: this, expression: expression, error: err}).message;
            }
          };
          return scope.execute();
        };

        var Scope = function(scope){
          this.$scope = scope;
        };

        Scope.prototype.execute = function(expression){
          return execute(this.$scope, expression);
        };
        Scope.prototype.createChild = function(param){
          var child = {},
              field;

          for(field in this.$scope){
            child[field] = this.$scope[field];
          }
          for(field in param){
            child[field] = param[field];
          }
          return new Scope(child);
        };
        return new Scope(scope);
      }
    },
    compiler = {
      $compile: function (scope, template, config) {
        return this.compile(scopes.create(scope), template, config);
      },
      compile: function (scope, template, config) {
        var result = {},
            self = this,
            compile = function(scope, template){
              return self.compile(scope, template, config);
            },
            getTemplate = function(path){
              return templates.create(JSON.parse(config.getTemplate(path)));
            };

        config = config ? config : {};

        //TODO invoke compile through $comiple (always)
        template.__ || (template = templates.create(template));

        if(template.isDirective()) {
          return directives.link(scope, template, compile, getTemplate);
        }

        for (var node in template) {
          var value       = template[node],
              isSubtree   = (typeof value == "object") && !(value instanceof Array);

          result[node] = isSubtree ? this.compile(scope, value, config) : linker.link(scope, value);
        }
        return result.render();
      }
};

Jeyson = {
  parse: function(scope, template, config){
    return template;
    return compiler.$compile(scope, template, config);
  }
}
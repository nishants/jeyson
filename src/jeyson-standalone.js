var
    createDirectives = function(){
      var repeater = {
            link: function(scope, template, params, compile){
              var varName   = params.split(" in ")[0].trim(),
                  listName  = params.split(" in ")[1].trim(),
                  list      = scope.execute(listName),
                  parsed    = [];

              for(var index = 0; index < list.length; index ++){
                var params        = {};
                params[varName]   = list[index];
                params["$index"]  = index;
                var newScope      = scope.createChild(params);
                parsed[index]     = compile(newScope, template.copy())
              }

              return parsed;
            }
          },
          compileD = {
            link: function(scope, template, params, compile){
              return compile(scope, scope.execute(params));
            }
          },
          include = {
            link: function(scope, template, params, compile, getTemplate){
              var includes = compile(scope, getTemplate(params));
              extend(true,
                  template,
                  includes);
            }
          },
          all = {};

      var Directives = {
        all: all,
        get: function (name) {
          return all[name];
        },
        add: function (name, definition) {
          all[name] = {link: definition.link};
        },
        link: function (scope, template, compile, getTemplate) {
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

          var replace = directive.directive.link(scope, template, param, compile, getTemplate);
          template = replace || compile(scope, template); // replace if directive returns valid value, else compile the template after directoryis done
          return template;
        }
      };
      Directives.add("@repeat", {link: repeater.link});
      Directives.add("@compile", {link: compileD.link});
      Directives.add("@include", {link: include.link});
      return Directives;
    },
    directives = createDirectives(),
    linker = {
      link: link = function(scope, element){
        var isString        = (typeof element == "string"),
            hasExpressions  = isString ? element.indexOf("{{") != -1 : false,
            expression      = hasExpressions ? element.split("{{")[1].split("}}")[0] : null,
            expressionValue = expression ? scope.execute(expression) : null,
            replace         = expression && (element.length > ("{{}}" + expression).length);

        expressionValue = replace ?  element.replace("{{"+expression+"}}", expressionValue) : expressionValue;

        return hasExpressions ? expressionValue : element;
      }
    },
    extend = function() {

      var hasOwn = Object.prototype.hasOwnProperty;
      var toStr = Object.prototype.toString;

      var isArray = function isArray(arr) {
        if (typeof Array.isArray === 'function') {
          return Array.isArray(arr);
        }

        return toStr.call(arr) === '[object Array]';
      };

      var isPlainObject = function isPlainObject(obj) {
        if (!obj || toStr.call(obj) !== '[object Object]') {
          return false;
        }

        var hasOwnConstructor = hasOwn.call(obj, 'constructor');
        var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
        // Not own constructor property must be Object
        if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
          return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        var key;
        for (key in obj) {/**/}

        return typeof key === 'undefined' || hasOwn.call(obj, key);
      };
      var options, name, src, copy, copyIsArray, clone,
          target = arguments[0],
          i = 1,
          length = arguments.length,
          deep = false;

      // Handle a deep copy situation
      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
      } else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
        target = {};
      }

      for (; i < length; ++i) {
        options = arguments[i];
        // Only deal with non-null/undefined values
        if (options != null) {
          // Extend the base object
          for (name in options) {
            src = target[name];
            copy = options[name];

            // Prevent never-ending loop
            if (target !== copy) {
              // Recurse if we're merging plain objects or arrays
              if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                if (copyIsArray) {
                  copyIsArray = false;
                  clone = src && isArray(src) ? src : [];
                } else {
                  clone = src && isPlainObject(src) ? src : {};
                }

                // Never move original objects, clone them
                target[name] = extend(deep, clone, copy);

                // Don't bring in undefined values
              } else if (typeof copy !== 'undefined') {
                target[name] = copy;
              }
            }
          }
        }
      }

      // Return the modified object
      return target;
    },

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
    templates = {
      create: function(template){
        template.__ = true; //TODO for trnsitioning to template model
        template.deleteDirective = function(name){
          delete this[name];
        };
        template.isDirective = function(){
          for(var field in this){
            if(field.startsWith("@")) {return true;}
          }
          return false;
        };

        template.render = function(){
          delete this.isDirective;
          delete this.render;
          delete this.deleteDirective;
          delete this.__;
          delete this.copy;
          return this;
        };

        template.copy = function(){
          var result = {};
          extend(true, result, this);
          return result;
        };

        return template
      }},
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
    return compiler.$compile(scope, template, config);
  }
}
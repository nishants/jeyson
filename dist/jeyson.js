var
    main        = "index",
    parentOf = function(path){
      path = path.split("/");
      return path.slice(0, path.length-1).join("/");
    },
    resolveRequire=  function(fromPath, requiredPath){
      var path  = requiredPath.replace(new RegExp("^./"), ""),
          from  = parentOf(fromPath);
      while(-1 != path.indexOf("../")){
        path = path.replace("../", "");
        from = parentOf(from);
      }
      return (from ? from + "/" : "") + path;
    },
    standalone  = {
      "compiler" : function(){return (function(){
  var script  = "compiler",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  var linker      = require("./linker"),
    scopes      = require("./scope"),
    templates   = require("./templates");

module.exports = {
  create: function(directives){
    var Compiler = {
      $compile: function (scope, template, config) {
        return this.compile(scopes.create(scope), template, config ? config : {});
      },
      compile: function (scope, template, config) {
        var self = this,
            compile = function (scope, template) {
              return self.compile(scope, templates.copy(template), config);
            },
            getTemplate = function (path) {
              return JSON.parse(config.getTemplate(path));
            };

        if (templates.hasDirective(template)) {
          return directives.link(scope, template, compile, getTemplate);
        }

        if (templates.isList(template)) {
          return template.map(function (element) {
            return compile(scope, element, config);
          });
        }

        if (templates.isSubtree(template)) {
          var result = {};
          for (var node in template) {
            var exclude = templates.isIgnored(scope, template[node]);
            if (!exclude) {
              result[node] = compile(scope, templates.cleanup(template[node]), config);
            }
          }
          return result;
        }

        return linker.link(scope, template);
      }
    };

    return Compiler;
  }
};

  return module.exports;
})();;},"directives" : function(){return (function(){
  var script  = "directives",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

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


  return module.exports;
})();;},"index" : function(){return (function(){
  var script  = "index",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

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

  return module.exports;
})();;},"linker" : function(){return (function(){
  var script  = "linker",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  module.exports = {
  link: link = function(scope, element){
    var isString        = (typeof element == "string"),
        hasExpressions  = isString ? element.indexOf("{{") != -1 : false,
        expression      = hasExpressions ? element.split("{{")[1].split("}}")[0] : null,
        expressionValue = expression ? scope.execute(expression) : null,
        replace         = expression && (element.length > ("{{}}" + expression).length);

    expressionValue = replace ?  element.replace("{{"+expression+"}}", expressionValue) : expressionValue;

    return hasExpressions ? expressionValue : element;
  }
};

  return module.exports;
})();;},"scope-error" : function(){return (function(){
  var script  = "scope-error",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  module.exports = {
    create: function(params){
      var message =  "<error> :  <expression> for <scope>"
                      .replace("<expression>", params.expression)
                      .replace("<scope>", JSON.stringify(params.scope))
                      .replace("<error>", params.error);
      return {
        message: message
      };
    }
}

  return module.exports;
})();;},"scope" : function(){return (function(){
  var script  = "scope",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  var error = require("./scope-error");

var execute = function (scope, expression) {
  var contextScript = "";
  for (var field in scope) {
    contextScript += ("var <field> = scope.<field>;".replace("<field>", field).replace("<field>", field));
  }
  scope.execute = function () {
    var escapeExpression = expression.replace(new RegExp("\'", 'g'), "\\'");
    try {
      return eval(contextScript + "eval('<expression>');".replace("<expression>", escapeExpression));
    }catch(err){
      return error.create({scope: scope, expression: expression, error: err}).message;
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

module.exports = {
  create : function(scope){
    return new Scope(scope);
  }
};


  return module.exports;
})();;},"templates" : function(){return (function(){
  var script  = "templates",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

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

  return module.exports;
})();;},"directives/compile" : function(){return (function(){
  var script  = "directives/compile",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  module.exports = {
  link: function(scope, body, params, compile){
    return compile(scope, scope.execute(params));
  }
};

  return module.exports;
})();;},"directives/if-else-then" : function(){return (function(){
  var script  = "directives/if-else-then",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  module.exports = {
  link: function(scope, body, params, compile){
    var elseBlock = body["@else"] || null,
        thenBlock = body["@then"],
        condition = scope.execute(params),
        showThen  = condition,
        showElse  = !condition;

    // TODO Extra attributes should be auto deleted by compiler.
    delete body["@else"];
    delete body["@then"];
    return condition ? thenBlock : elseBlock;
  }
};

  return module.exports;
})();;},"directives/include" : function(){return (function(){
  var script  = "directives/include",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  var extend = require("../support/extend");

module.exports = {
  link: function(scope, body, params, compile, getTemplate){
    extend(
        true,
        body,
        compile(scope, getTemplate(params))
    );
  }
};

  return module.exports;
})();;},"directives/repeat" : function(){return (function(){
  var script  = "directives/repeat",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  module.exports = {
  link: function(scope, body, params, compile){
    var varName   = params.split(" in ")[0].trim(),
        listName  = params.split(" in ")[1].trim(),
        list      = scope.execute(listName),
        parsed    = [];

    for(var index = 0; index < list.length; index ++){
      var params        = {};
      params[varName]   = list[index];
      params["$index"]  = index;
      var newScope      = scope.createChild(params);
      parsed[index]     = compile(newScope, body)
    }

    return parsed;
  }
};

  return module.exports;
})();;},"support/extend" : function(){return (function(){
  var script  = "support/extend",
      module  = {exports: null},
      require = function (requiredPath) {
        return standalone.run(resolveRequire(script, requiredPath));
      };

  var extend = function() {

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
};

module.exports = extend;


  return module.exports;
})();;},
      run : function (path) {
        return standalone[path]();
      },
    };
var global = GLOBAL || Window
global.Jeyson = standalone[main]();

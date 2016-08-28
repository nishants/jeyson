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

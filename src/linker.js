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
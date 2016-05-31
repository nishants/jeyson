module.exports = {
  link: function(scope, template, params, compile){
    return compile(scope, scope.execute(params));
  }
};
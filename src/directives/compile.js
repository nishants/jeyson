module.exports = {
  link: function(scope, body, params, compile){
    return compile(scope, scope.execute(params));
  }
};
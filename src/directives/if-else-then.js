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
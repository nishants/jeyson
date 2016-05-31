module.exports = {
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
};
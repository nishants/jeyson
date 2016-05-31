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
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
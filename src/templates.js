var extend = require("extend");
var create = function(template){
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
};

module.exports = {
  create: function(template){
    return create(template);
  }
};
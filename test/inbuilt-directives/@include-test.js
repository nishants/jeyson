var expect    = require('chai').expect,
    compiler  = require('../../src/index').create();

describe('@include', function() {
  var templatePath  = "../__partial",
      template      = {
        name     : "fromParent",
        "@include" :  templatePath
      },
      expectTemplate = function(expectedPath, tempate){
        return {getTemplate: function(path){
          expect(path).to.eql(expectedPath);
          return JSON.stringify(tempate);
        }};
      };

  it('should include a json', function () {
    var expected      = {
          name     : "fromParent",
          origin   :  "template"
        },
        result ;

    result = compiler.compile({}, template, expectTemplate(templatePath, {"origin": "template"}));

    expect(result).to.eql(expected);
  });

  it('should support expressions in template', function () {
    var scope         = {message: "hello world !"},
        expected      = {
          name     : "fromParent",
          "origin" :  "hello world !"
        },
        template      = {
          name     : "fromParent",
          "@include" :  templatePath
        },
        result ;

    result = compiler.compile(scope, template, expectTemplate(templatePath, {"origin": "{{message}}"}));

    expect(JSON.stringify(result)).to.eql(JSON.stringify(expected));
  });

  it('should support in built directives in template', function () {
    var scope         = {list : ['one', 'two']},
        expected      = {
          name   : "fromParent",
          "list"   :  [{name : "one"},{name : "two"}]
        },
        template      = {
          name     : "fromParent",
          "@include" :  templatePath
        },
        result ;

    result = compiler.compile(scope, template, expectTemplate(templatePath, {
      list: {
        "@repeat": "val in list",
        name: "{{val}}"}
    }));

    expect(result).to.eql(expected);
  });

});

var expect    = require('chai').expect,
    compiler  = require('../../src/index').create();

describe('@include', function() {
  var templatePath  = "../__partial",
      template      = {
        "name"     : "fromParent",
        "@include" :  templatePath
      },
      getTemplate = function(path){
        expect(path).to.eql(templatePath);
        return '{"origin": "template"}';
      };

  it('should include a json', function () {
    var scope         = {},
        expected      = {
          "name"     : "fromParent",
          "origin"   :  "template"
        },
        result ;

    result = compiler.compile(scope, template, {getTemplate: getTemplate});

    expect(JSON.stringify(result)).to.eql(JSON.stringify(expected));
  });

  it('should support expressions in template', function () {
    var scope         = {message: "hello world !"},
        expected      = {
          "name"     : "fromParent",
          "origin"   :  "hello world !"
        },
        template      = {
          "name"     : "fromParent",
          "@include" :  templatePath
        },
        getTemplate = function(path){
          expect(path).to.eql(templatePath);
          return '{"origin": "{{message}}"}';
        },
        result ;

    result = compiler.compile(scope, template, {getTemplate: getTemplate});

    expect(JSON.stringify(result)).to.eql(JSON.stringify(expected));
  });

  it('should support in built directives in template', function () {
    var scope         = {list : ['one', 'two']},
        expected      = {
          "name"   : "fromParent",
          "list"   :  [{"name" : "one"},{"name" : "two"}]
        },
        template      = {
          "name"     : "fromParent",
          "@include" :  templatePath
        },
        getTemplate = function(path){
          expect(path).to.eql(templatePath);
          return JSON.stringify({
            list: {
              "@repeat": "val in list",
              "name": "{{val}}"}
          });
        },
        result ;

    result = compiler.compile(scope, template, {getTemplate: getTemplate});

    expect(result).to.eql(expected);
  });

});

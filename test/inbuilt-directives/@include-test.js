var expect    = require('chai').expect,
    compiler  = require('../../src/index').create();

describe('@include', function() {
  it('should include a json', function () {
    var scope         = {},
        templatePath  = "../__partial",
        expected      = {
          "name"     : "fromParent",
          "origin"   :  "template"
        },
        template      = {
          "name"     : "fromParent",
          "@include" :  templatePath
        },
        readFile = function(path){
          expect(path).to.eql(templatePath);
          return '{"origin": "template"}';
        },
        result ;

    result = compiler.compile(scope, template, {readFile: readFile});

    expect(JSON.stringify(result)).to.eql(JSON.stringify(expected));
  });

  it('should support expressions in template', function () {
    var scope         = {message: "hello world !"},
        templatePath  = "../__partial",
        expected      = {
          "name"     : "fromParent",
          "origin"   :  "hello world !"
        },
        template      = {
          "name"     : "fromParent",
          "@include" :  templatePath
        },
        readFile = function(path){
          expect(path).to.eql(templatePath);
          return '{"origin": "{{message}}"}';
        },
        result ;

    result = compiler.compile(scope, template, {readFile: readFile});

    expect(JSON.stringify(result)).to.eql(JSON.stringify(expected));
  });

  it.skip('should support in built directives in template', function () {
    var scope         = {list : ['one', 'two']},
        templatePath  = "../__partial",
        expected      = {
          "name"   : "fromParent",
          "list"   :  [{"name" : "one"},{"name" : "two"}]
        },
        template      = {
          "name"     : "fromParent",
          "@include" :  templatePath
        },
        readFile = function(path){
          expect(path).to.eql(templatePath);
          return JSON.stringify({
            list: {
              "@repeat": "val in list",
              "name": "{{val}}"}
          });
        },
        result ;

    result = compiler.compile(scope, template, {readFile: readFile});

    expect(result).to.eql(expected);
  });

});

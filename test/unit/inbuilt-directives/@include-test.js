var expect    = require('chai').expect,
    compiler  = require('../../../src/index').create();

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
        included = {"origin": "template"},
        result ;

    result = compiler.compile({}, template, expectTemplate(templatePath, included));

    expect(result).to.eql(expected);
  });

  it('should support expressions in template', function () {
    var scope         = {message: "hello world !"},
        expected      = {
          name     : "fromParent",
          origin   :  "hello world !"
        },
        template      = {
          name       : "fromParent",
          "@include" :  templatePath
        },
        included = {"origin": "{{message}}"},
        result ;

    result = compiler.compile(scope, template, expectTemplate(templatePath, included));

    expect(JSON.stringify(result)).to.eql(JSON.stringify(expected));
  });

  it('should support directive in subtree', function () {
    var scope         = {list : ['one', 'two']},
        expected      = {
          listOne   : ["1", "2", "3", "4", "5"],
          listTwo :  [{name : "one"},{name : "two"}]
        },
        template      = {
          listOne     : "{{'1,2,3,4,5'.split(',')}}",
          "@include" :  templatePath
        },
        included = {
          listTwo: {
            "@repeat": "val in list",
            name: "{{val}}"
          }
        },
        result;

    result = compiler.compile(scope, template, expectTemplate(templatePath, included));

    expect(result).to.eql(expected);
  });

  it('should support in built directives in template', function () {
    var scope         = {list : ['one', 'two']},
        expected      = {
          listOne   : ["1", "2", "3", "4", "5"],
          sub: {
            listTwo :  [{name : "one"},{name : "two"}]
          }
        },
        template      = {
          listOne     : "{{'1,2,3,4,5'.split(',')}}",
          sub: {
            "@include" :  templatePath
          }
        },
        included = {
          listTwo: {
            "@repeat": "val in list",
            name: "{{val}}"}
        },
        result ;

    result = compiler.compile(scope, template, expectTemplate(templatePath, included));

    expect(result).to.deep.equal(expected);
  });

});

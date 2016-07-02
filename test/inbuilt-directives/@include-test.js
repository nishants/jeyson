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
});

var expect    = require('chai').expect,
    compiler  = require('../../src/index').create();

describe('@include', function() {
  it('should include a json', function () {
    var scope       = {},
        template = {
          "name" : "fromParent",
          "@include" :""
        },
        expected = {origin: "template"},
        relativePath = "../__partial",
        readFile = function(path){
          expect(path).to.eql(relativePath);
          return {origin: "template"};
        },
        result ;

    result = compiler.compile(scope, template, {readFile: readFile});

    expect(result).to.eql(expected);
  });
});

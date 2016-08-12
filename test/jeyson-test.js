var expect          = require('chai').expect,
    helper          = require("./support/test-helper"),
    standalone_path = '../src/jeyson.js',
    scope,
    config;


describe('JeysonTest', function() {
  before(function(){
    require(standalone_path);
  });

  beforeEach(function(){
    scope     = {};
    config    = {};
  });

  it('should parse a simple json', function () {
    helper.specs().forEach(function(spec){
      expect(Jeyson.parse(spec.scope, spec.template, spec.config)).to.eql(spec.result);
    });
  });
});

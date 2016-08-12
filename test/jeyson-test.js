var expect          = require('chai').expect,
    helper          = require("./support/test-helper"),
    STANDALONE_PATH = '../src/jeyson.js',
    setup           = function(config){
      config.getTemplate = helper.getTemplate
      return config;
    };


describe('JeysonTest', function() {
  before(function(){
    require(STANDALONE_PATH);
  });

  it('should parse a simple json', function () {
    helper.specs().forEach(function(spec){
      expect(Jeyson.parse(spec.scope, spec.template, setup(spec.config))).to.eql(spec.result);
    });
  });
});

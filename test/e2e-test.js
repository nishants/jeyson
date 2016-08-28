var expect          = require('chai').expect,
    helper          = require("./support/test-helper"),
    STANDALONE_PATH = '../src/jeyson-standalone.js',
    jeyson          = require('../src/index.js').create(),
    setup           = function(config){
      config.getTemplate = helper.getTemplate
      return config;
    };

describe('e2e', function() {
  before(function(){
    require(STANDALONE_PATH);
  });

  describe('Module', function() {
    helper.specs().forEach(function(spec){
      it(spec.filename, function () {
        expect(jeyson.compile(spec.scope, spec.template, setup(spec.config))).to.eql(spec.result);
      });
    });
  });

  describe('Standalone', function() {
    helper.specs().forEach(function(spec){
      it(spec.filename, function () {
        expect(Jeyson.parse(spec.scope, spec.template, setup(spec.config))).to.eql(spec.result);
      });

    });
  });

});


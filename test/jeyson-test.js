var expect          = require('chai').expect,
    helper          = require("./support/test-helper"),
    jeyson          = require('../src/index.js').create(),
    setup           = function(config){
      config.getTemplate = helper.getTemplate
      return config;
    };


describe('Jeyson Module Specs', function() {
  helper.specs().forEach(function(spec){
    it(spec.filename, function () {
      expect(jeyson.compile(spec.scope, spec.template, setup(spec.config))).to.eql(spec.result);
    });
  });
});

var expect          = require('chai').expect,
    helper          = require("./../support/test-helper"),
    jeyson          = require('../../src/index.js').create(),
    config          = {
      getTemplate : helper.getTemplate
    };

describe('e2e : Module', function() {
  helper.specs().forEach(function(spec){
    it(spec.filePath, function () {
      expect(jeyson.compile(spec.scope, spec.template, config)).to.eql(spec.result);
    });
  });

});


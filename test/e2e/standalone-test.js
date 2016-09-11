var expect          = require('chai').expect,
    helper          = require("../test-helper"),
    STANDALONE_PATH = '../../dist/jeyson.js',
    config          = {
      getTemplate : helper.getTemplate
    };

describe('e2e : Standalone', function() {
  before(function(){
    require(STANDALONE_PATH);
  });

  helper.specs().forEach(function(spec){
    it(spec.filePath, function () {
      expect(Jeyson.create().compile(spec.scope, spec.template, config)).to.eql(spec.result);
    });
  });
});


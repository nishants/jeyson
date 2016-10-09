var expect          = require('chai').expect,
    helper          = require("../test-helper"),
    STANDALONE_PATH = '../../dist/jeyson-browser',
    config          = {
      getTemplate : helper.getTemplate
    };

describe('e2e : Browser Script', function() {
  before(function(){
    GLOBAL.window = GLOBAL;
    require(STANDALONE_PATH);
  });

  helper.specs().forEach(function(spec){
    it(spec.filePath, function () {
      expect(Jeyson.create().compile(spec.scope, spec.template, config)).to.eql(spec.result);
    });
  });
});


var expect          = require('chai').expect,
    helper          = require("./support/test-helper"),
    STANDALONE_PATH = '../src/jeyson-standalone.js',
    jeyson          = require('../src/index.js').create(),
    config          = {
      getTemplate : helper.getTemplate
    },
    pendingForStandalone = {
      "if-else-then_spec.json" : true,
      "undefined_directives_spec.json" : true,
      "arrays_spec.json" : true,
      "include_template_in_array_spec.json" : true,
    };

describe('e2e', function() {
  before(function(){
    require(STANDALONE_PATH);
  });

  describe('Module', function() {
    helper.specs().forEach(function(spec){
      it(spec.filePath, function () {
        expect(jeyson.compile(spec.scope, spec.template, config)).to.eql(spec.result);
      });
    });
  });

  describe('Standalone', function() {
    helper.specs().forEach(function(spec){
      if(pendingForStandalone[spec.filename]){
        it.skip("Standalone : "+spec.filePath, function(){});
      } else{
        it(spec.filePath, function () {
          expect(Jeyson.parse(spec.scope, spec.template, config)).to.eql(spec.result);
        });
      }
    });
  });

});


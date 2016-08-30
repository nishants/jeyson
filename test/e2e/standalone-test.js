var expect          = require('chai').expect,
    helper          = require("../test-helper"),
    STANDALONE_PATH = '../../src/jeyson-standalone.js',
    config          = {
      getTemplate : helper.getTemplate
    },
    pendingForStandalone = {
      "if-else-then_spec.json"                    : true,
      "arrays_spec.json"                          : true,
      "undefined_directives_spec.json"            : true,
      "include_template_in_array_spec.json"       : true,
      "conditional-blocks/if-else-then_spec.json" : true
    };

describe('e2e : Standalone', function() {
  before(function(){
    require(STANDALONE_PATH);
  });

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


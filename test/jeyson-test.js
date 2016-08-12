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
    var template  = helper.plainJson();
    expect(Jeyson.parse(scope, template, config)).to.eql({message: "hello"});
  });
});

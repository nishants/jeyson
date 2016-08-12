var expect          = require('chai').expect,
    helper          = require("./support/test-helper"),
    standalone_path = "../src/standalone";

require('../src/jeyson.js');

describe('JeysonTest', function() {
  it('should parse a simple json', function () {
    var template  = helper.getPlainJson();
    expect(Jeyson.parse(template)).to.eql({message: "hello"});
  });
});

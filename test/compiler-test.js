var expect  = require('chai').expect,
    jsong  = require("../src/index.js");

describe('Compile jso-ng', function() {

  it('should find, execute and replace expressions by there values', function () {
    var scope       = {"id" : "some-id"},
        template    = {id: "my-{{id}}"},
        parsed      = jsong.compile(scope, template);

    expect(parsed.id).to.equal("my-some-id");
  });

  it('should support numbers and booleans in expression return type', function () {
    var scope       = {"crazy" : false, sober: true},
        template    = {crazy: "{{crazy}}", sober: "{{sober}}"},
        parsed      = jsong.compile(scope, template);

    expect(parsed.sober).to.equal(true);
    expect(parsed.crazy).to.equal(false);
  });

  it('should parse sub trees', function () {
    var scope       = {"id" : "some-id"},
        template = {item: {id: "my-{{id}}"}},
        parsed   = jsong.compile(scope, template);

    expect(parsed.item.id).to.equal("my-some-id");
  });

  it('should parse complex sub trees', function () {
    var scope       = {item: {"id": "one", "name": "me", "address": "home"}},
        template = {
          item: {
            id      : "id is {{item.id}}",
            name    : "name is {{item.name}}",
            address : {
              street : "street is {{item.address}}"
            }
          }},
        parsed   = jsong.compile(scope, template);

    expect(parsed.item.id).to.equal("id is one");
    expect(parsed.item.name).to.equal("name is me");
    expect(parsed.item.address.street).to.equal("street is home");
  });

});
var expect    = require('chai').expect,
    compiler  = require('../../../src/index').create();

describe('Repeater', function() {
  it('should replace directory template with list', function () {
    var scope       = {},
        template = {
          "data" : {
            "@repeat" : "item in [{name: 'one'},{name: 'two'}, {name: 'three'}]",
            "id"      : "{{$index + 1}}",
            "name"    : "{{item.name}}"
          }
        },
        expected = {
          "data" : [
            {"id" : 1, "name": "one"},
            {"id" : 2, "name": "two"},
            {"id" : 3, "name": "three"}
          ]
        },
        result ;

    result = compiler.compile(scope, template);

    expect(result.data.length).to.equal(3);
    expect(result.data[0].id).to.equal(expected.data[0].id);
    expect(result.data[1].id).to.equal(expected.data[1].id);
    expect(result.data[2].id).to.equal(expected.data[2].id);
    expect(result.data[0].name).to.equal(expected.data[0].name);
    expect(result.data[1].name).to.equal(expected.data[1].name);
    expect(result.data[2].name).to.equal(expected.data[2].name);
  });

  it('should allow nested repeaters', function () {
    var scope       = {list : [["a1", "a2", "a3"]]},
        template = {
          "list" : {
            "@repeat" : "outer in list",
            "id" : "{{$index + 1}}",
            "value" :{
              "@repeat" : "inner in outer",
              "id" : "{{inner}}"
            }
          }
        },
        expected = {
          list : [
            {id: 1, value: [{id: "a1"}, {id: "a2"}, {id: "a3"}]}
          ]
        },
        result ;

    result = compiler.compile(scope, template);

    expect(result.list.length).to.equal(1);
    expect(result.list[0].id).to.equal(expected.list[0].id);
    expect(result.list[0].value).to.eql([{id: "a1"}, {id: "a2"}, {id: "a3"}]);
  });

  it('should support nested repeat', function () {
    var scope       = {list : [["a1", "a2", "a3"],["b1", "b2", "b3"]]},
        template = {
          "list" : {
            "@repeat" : "outer in list",
            "id" : "{{$index + 1}}",
            "value" :{
              "@repeat" : "inner in outer",
              "id" : "{{inner}}"
            }
          }
        },
        expected = {
          list : [
            {id: 1, value: [{id: "a1"}, {id: "a2"}, {id: "a3"}]},
            {id: 2, value: [{id: "b1"}, {id: "b2"}, {id: "b3"}]}
          ]
        },
        result ;

    result = compiler.compile(scope, template);

    expect(result.list.length).to.equal(2);
    expect(result.list[0].id).to.equal(expected.list[0].id);
    expect(result.list[1].id).to.equal(expected.list[1].id);

    expect(result.list[0].value).to.eql([{id: "a1"}, {id: "a2"}, {id: "a3"}]);
    expect(result.list[1].value).to.eql([{id: "b1"}, {id: "b2"}, {id: "b3"}]);
  });
});

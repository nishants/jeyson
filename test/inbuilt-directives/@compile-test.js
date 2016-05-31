var expect    = require('chai').expect,
    compiler  = require('../../src/index').create();

describe('@compile', function() {
  it('should compile an expression', function () {
    var scope       = {
          "request" : {
            "src" : {
              "body": {
                "list"      : "{{ 'one,two,three,four,five'.split(',') }}",
              }
            }
          }
        },
        template = {
          "data" : {
            "@compile" : "request.src.body",
          }
        },
        expected = {
          "data" : {
            "list"      : ["one", "two", "three", "four", "five"],}
        }        ,
        result ;

    result = compiler.compile(scope, template);

    expect(result.data.list.length).to.equal(5);
    expect(result).to.eql(expected);
  });
});

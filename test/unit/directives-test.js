var expect    = require('chai').expect,
    jeyson    = require('../../src/index').create();

describe('Directives', function() {
  it('should ignore directive if not defined', function () {
    var template = {
          "data" : [1,2,3],
          "@foo" : "foo-param"
        },
        expected = {
          "data" : [1,2,3],
          "@foo" : "foo-param"
        },
        result ;

    expect(jeyson.compile({}, template)).to.deep.equal(expected);
  });

  it('should replace directive body with parsed result', function () {
    var template = {
          "data" : {
            "fooTarget" : {
              "@foo" : "foo-param"
            }
          }
        },
        result ;

    jeyson.directive("@foo", {
      link: function(scope, body, param){
        expect(param).to.equal("foo-param");
        return "bar";
      }
    });

    result = jeyson.compile({}, template);
    expect(result.data.fooTarget).to.equal("bar");
  });

  it('should process a directive inside an array', function () {
    var template = {
          "data" : [{"fooTarget" : {"@foo" : "foo-param"}}]
        },
        expected = {
          "data" : [{"fooTarget" : "bar"}]
        },
        result ;

    jeyson.directive("@foo", {
      link: function(scope, body, param){
        expect(param).to.equal("foo-param");
        return "bar";
      }
    });

    expect(jeyson.compile({}, template)).to.deep.equal(expected);
  });

  it('should replace directive body with a subtree', function () {
    var template = {
          "data" : {
            "fooTarget" : {
              "@foo" : "foo-param"
            }
          }
        },
        result ;

    jeyson.directive("@foo", {
      link: function(){
        return {child: "bar"};
      }
    });

    result = jeyson.compile({}, template);
    expect(result.data.fooTarget.child).to.equal("bar");
  });

  it('should apply nested directives', function () {
    var template = {
          "data" : {
            "fooTarget" : {
              "@foo" : "foo-param",
              "fooTarget" : {
                "@foo" : "foo-param"
              }
            }
          }
        },
        result ;

    jeyson.directive("@foo", {
      link: function(scope, body){
        body.child = "foodified";
      }
    });

    result = jeyson.compile({}, template);
    expect(result.data.fooTarget.child).to.equal("foodified");
    expect(result.data.fooTarget.fooTarget.child).to.equal("foodified");
  });

  it('should allow executing expressoin in directive', function () {
    var scope    = {param: "replaced by expression"},
        template = {
          "data" : {
            "fooTarget" : {
              "@foo" : "foo-param",
            }
          }
        },
        result ;

    jeyson.directive("@foo", {
      link: function(scope){
        return scope.execute("param");
      }
    });

    result = jeyson.compile(scope, template);
    expect(result.data.fooTarget).to.equal("replaced by expression");
  });

  it('should allow directives in template returned from directive', function () {
    var scope    = {param: "found"},
        template = {
          "data" : {
            "fooTarget" : {
              "@foo" : "foo-param"
            }
          }
        },
        result ;

    jeyson.directive("@foo", {
      link: function(scope, body, param, compile){
        return compile(scope, {
          child: "{{param}}",
          "@bar": "bar-param",
        });
      }
    });

    jeyson.directive("@bar", {
      link: function(scope, body, param){
        body.otherChild = "bar";
        expect(param).to.equal("bar-param");
      }
    });

    result = jeyson.compile(scope, template);
    expect(result.data.fooTarget.child).to.equal("found");
    expect(result.data.fooTarget.otherChild).to.equal("bar");
  });

});

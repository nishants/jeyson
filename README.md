# jso-ng
A JSON template system.

### Compiling a template against a scope

```javascript
    var jsong  = require("../src/index.js").create(),
        scope  = {name : 'seeker'},
        template = {
          "message"   : "hello",
          "sum"       : "{{0 + 1 }}",
          "boolean"   : "{{1 == 2}}",
          "list"      : "{{ 'one,two,three,four,five'.split(',') }}",
          "repeater"  : {"@repeat" : "count in [1,2,3,4,5]", "id": "{{$index + count}}"}
        },
        expected = {
          "message" : "hello",
          "sum"     : 1,
          "boolean" : false,
          "list"    : ["one", "two", "three", "four", "five"],
          "repeater": [{"id": 1}, {"id": 3}, {"id": 5}, {"id": 7}, {"id": 9}]
        },
        result = jsong.compile(scope, template);

    expect(result).to.eql(expected);
```

### Custom directives

```javascript
    var scope    = {param: "found"},
        app       = jsong.create(),
        template = {
          "data" : {
            "fooTarget" : {
              "@foo" : "foo-param"
            }
          }
        },
        result ;

    app.directive("@foo", {
      link: function(scope, body, param, compile){
        return compile(scope, {
          child: "{{param}}",
          "@bar": "bar-param",
        });
      }
    });

    app.directive("@bar", {
      link: function(scope, body, param){
        body.otherChild = "bar";
        expect(param).to.equal("bar-param");
      }
    });

    result = jsong.compile(scope, template);
    expect(result.data.fooTarget.child).to.equal("found");
    expect(result.data.fooTarget.otherChild).to.equal("bar");

```

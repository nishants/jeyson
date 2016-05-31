var expect  = require('chai').expect,
    scopes  = require("../src/scope");

describe('Scope Test', function() {

  it('should inject fields with primary values to context', function () {
    var scope       = scopes.create({id: 1}),
        expression  = "id + 99";
    expect(scope.execute(expression)).to.equal(100);
  });

  it('should allow operation on context values', function () {
    var scope      = scopes.create({id: 1, name: "Vijay"}),
        expression = '(id + 99) + "-" + name';
    expect(scope.execute(expression)).to.equal("100-Vijay");
  });

  it('should not update context values', function () {
    var injected    = {id: 1, name: "Vijay"},
        scope       = scopes.create(injected),
        expression  = 'id = 2';
    expect(scope.execute(expression)).to.equal(2);
    expect(injected.id).to.equal(1);
  });

  it('should inject object fields', function () {
    var scope       = scopes.create({
          data: {id: 1,
            address: {street: "my-home"}
          }
        }),
        expression  = 'data.id + "-" + data.address.street';

    expect(scope.execute(expression)).to.equal("1-my-home");
  });

  it('should allow calling function on injectables', function () {
    var scope       = scopes.create({
          callMe: function(){return "called-me";},
          child: {callMeToo: function(){
            return "called-me-too";}
          }
        }),
        expression  = 'callMe() + "-" + child.callMeToo()';

    expect(scope.execute(expression)).to.equal("called-me-called-me-too");
  });

  it('should create child scopes', function () {
    var scope = scopes.create({
          name: "outer",
          foo: function(){return "foo"},
        }),
        childScope = scope.createChild({
          bar: function(){
            return "bar";
          }
        }),
        expression = '{{name + "-" + foo() +"-"+ bar()}}';

    expect(childScope.execute(expression)).to.equal("outer-foo-bar");
  });

  it('should escape strings in expressions', function () {
    var scope      = scopes.create({name: "scope-name"}),
        expression = "{{name + ''}}";

    expect(scope.execute(expression)).to.equal("scope-name");
  });

  it('should override parent scope', function () {
    var scope      = scopes.create({name: "parent-name"}),
        child      = scope.createChild({name: "child-name"}),
        expression = "{{name}}";

    expect(child.execute(expression)).to.equal("child-name");
  });

  it('should return error if expression is invalid', function () {
    var scope      = scopes.create({name: "parent-name"}),
        expression = "{{notKnown}}",
        expectedErrorMessage = 'ReferenceError: notKnown is not defined :  {{notKnown}} for {"name":"parent-name"}';

    expect(scope.execute(expression)).to.equal(expectedErrorMessage);
  });

  it('should return number type if expression resolves to number', function () {
    var scope      = scopes.create({id: 1}),
        expression = "{{id}}";

    expect(scope.execute(expression)).to.equal(1);
  });
});

var expect    = require('chai').expect,
    temlpates = require('../src/templates');

describe('TemplateTest', function() {
  it('should clear template before rendering', function () {
    var temlpate  = temlpates.create({});
    expect(temlpate.render()).to.eql({});
  });

  it('template is a directive if one of its field starts with "@"', function () {
    var notHas  = temlpates.create({"id": 1, "name": "My Name"}),
        has     = temlpates.create({"id": 1, "@name": "My Name"});
    expect(notHas.isDirective()).to.equal(false);
    expect(has.isDirective()).to.equal(true);
  });

  it('template.copy should return deep copy of current template', function () {
    var template    = temlpates.create({"id": 1, "name": "My Name"}),
        templateOne = template.copy();

    expect(templateOne.id).to.equal(1);
    expect(templateOne.name).to.equal("My Name");

    templateOne.id = "replaced";
    expect(template.id).to.equal(1);
  });
});

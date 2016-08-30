var expect    = require('chai').expect,
    templates = require('../src/templates');

describe('TemplateTest', function() {
  it('template is a directive if one of its field starts with "@"', function () {
    var notHas  = {"id": 1, "name": "My Name"},
        has     = {"id": 1, "@name": "My Name"};
    expect(templates.isDirective(notHas)).to.equal(false);
    expect(templates.isDirective(has)).to.equal(true);
  });

  it('template.copy should return deep copy of current template', function () {
    var template    = {"id": 1, "name": "My Name"},
        templateOne = templates.copy(template);

    expect(templateOne.id).to.equal(1);
    expect(templateOne.name).to.equal("My Name");

    templateOne.id = "replaced";
    expect(template.id).to.equal(1);
  });

  it('template.copy should copy a list type', function () {
    var template    = ["one", "two"],
        copy        = templates.copy(template);

    expect(copy).to.deep.equal(template);
  });
});

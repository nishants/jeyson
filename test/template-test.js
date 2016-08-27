var expect    = require('chai').expect,
    templates = require('../src/templates');

describe('TemplateTest', function() {
  it('should clear template before rendering', function () {
    var temlpate  = templates.create({});
    expect(temlpate.render()).to.eql({});
  });

  it('template is a directive if one of its field starts with "@"', function () {
    var notHas  = templates.create({"id": 1, "name": "My Name"}),
        has     = templates.create({"id": 1, "@name": "My Name"});
    expect(templates.isDirective(notHas)).to.equal(false);
    expect(templates.isDirective(has)).to.equal(true);
  });

  it('template.copy should return deep copy of current template', function () {
    var template    = templates.create({"id": 1, "name": "My Name"}),
        templateOne = templates.copy(template);

    expect(templateOne.id).to.equal(1);
    expect(templateOne.name).to.equal("My Name");

    templateOne.id = "replaced";
    expect(template.id).to.equal(1);
  });
});

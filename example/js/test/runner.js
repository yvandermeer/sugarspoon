(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var BaseTestConfiguration, TestConfiguration, TestRunner, chaiJQuery, runner, tests, _ref;
    chaiJQuery = require('chai-jquery');
    TestRunner = require('sugarspoon/main');
    BaseTestConfiguration = require('sugarspoon/model/configuration');
    tests = require('test/main');
    TestConfiguration = (function(_super) {
      __extends(TestConfiguration, _super);

      function TestConfiguration() {
        _ref = TestConfiguration.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      TestConfiguration.prototype.configure = function() {
        TestConfiguration.__super__.configure.apply(this, arguments);
        return this.chai.use(chaiJQuery);
      };

      return TestConfiguration;

    })(BaseTestConfiguration);
    runner = new TestRunner({
      config: new TestConfiguration,
      coverage: true,
      blanketOptions: {
        filter: /\/app\//,
        antifilter: /(?:vendor|spec|src)\//,
        branchTracking: false,
        debug: true
      }
    });
    return runner.run(tests);
  });

}).call(this);

/*
//@ sourceMappingURL=runner.js.map
*/
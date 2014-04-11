(function() {
  define(function(require) {
    var $, Fixtures, SettingsPanel, TestConfiguration, TestRunner, TestSettings, _;
    _ = require('underscore');
    $ = require('jquery');
    TestConfiguration = require('./model/configuration');
    TestSettings = require('./model/settings');
    SettingsPanel = require('./view/settingspanel');
    Fixtures = require('./view/fixtures');
    return TestRunner = (function() {
      /*
      The main Sugarspoon testrunner
      
      Provides a public API for running a series of Mocha unit test suites. Actual
      implementation is delegated to either a straight-up Mocha test runner or a
      Blanket coverage runner.
      */

      TestRunner.prototype.views = {};

      function TestRunner(options) {
        var coverageEnabled, coverageSupported,
          _this = this;
        if (options == null) {
          options = {};
        }
        this.config = (function() {
          if (options.config instanceof TestConfiguration) {
            return options.config;
          }
          if (_(options.config).isFunction()) {
            TestConfiguration.prototype.configure = options.config;
          }
          return new TestConfiguration;
        })();
        this.settings = TestSettings.get();
        this.views.settingsPanel = new SettingsPanel({
          model: this.settings
        });
        this.views.settingsPanel.listenTo(this.settings, {
          'change:coverage change:showFixtures': function() {
            return window.location.reload();
          }
        });
        this.views.fixtures = new Fixtures({
          el: '#fixtures',
          model: this.settings
        });
        coverageSupported = !window.mochaPhantomJS;
        coverageEnabled = coverageSupported && this.settings.get('coverage');
        this.runnerLoaded = new $.Deferred;
        if (coverageEnabled) {
          require(['./runner/coverage'], function(CoverageRunner) {
            _this.runner = new CoverageRunner(_(options).pick('blanketOptions'));
            return _this.runnerLoaded.resolve();
          });
        } else {
          require(['./runner/mocha'], function(MochaTestRunner) {
            _this.runner = new MochaTestRunner;
            return _this.runnerLoaded.resolve();
          });
        }
      }

      TestRunner.prototype.run = function(tests) {
        var _this = this;
        if (tests == null) {
          tests = 'test/main';
        }
        return $.when(this.config.done, this.runnerLoaded).then(function() {
          if (!_this.runner) {
            console.error('No test runner defined!');
            return;
          }
          return _this.runner.run(tests);
        });
      };

      return TestRunner;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/
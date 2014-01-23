(function() {
  define(function(require) {
    var $, FixturesContainer, MochaTestRunner, SettingsPanel, TestConfiguration, TestSettings, TestWrapper, _;
    _ = require('underscore');
    $ = require('jquery');
    MochaTestRunner = require('./runners/mocha');
    TestConfiguration = require('./model/configuration');
    TestSettings = require('./model/settings');
    SettingsPanel = require('./view/settingspanel');
    FixturesContainer = require('./view/fixturescontainer');
    return TestWrapper = (function() {
      TestWrapper.prototype.views = {};

      TestWrapper.prototype.data = {};

      function TestWrapper(options) {
        var coverageEnabled, coverageFilter, coverageSupported,
          _this = this;
        if (options == null) {
          options = {};
        }
        this.config = (function() {
          if (options.config instanceof TestConfiguration) {
            return options.config;
          }
          if (_.isFunction(options.config)) {
            TestConfiguration.prototype.configure = options.config;
          }
          return new TestConfiguration;
        })();
        this.settings = TestSettings.get();
        this.views.settingsPanel = new SettingsPanel({
          model: this.settings
        });
        this.views.settingsPanel.listenTo(this.settings, 'change:coverage change:showFixtures', function() {
          return window.location.reload();
        });
        this.views.fixtures = new FixturesContainer({
          el: '#fixtures',
          model: this.settings
        });
        coverageSupported = !window.mochaPhantomJS;
        coverageEnabled = coverageSupported && this.settings.get('coverage');
        this.runnerLoaded = new $.Deferred;
        if (coverageEnabled) {
          coverageFilter = _.isString(options.coverage) ? options.coverage : null;
          require(['./runners/coverage'], function(CoverageRunner) {
            _this.runner = new CoverageRunner(coverageFilter);
            return _this.runnerLoaded.resolve();
          });
        } else {
          this.runner = new MochaTestRunner;
          this.runnerLoaded.resolve();
        }
      }

      TestWrapper.prototype.run = function(tests) {
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

      return TestWrapper;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/
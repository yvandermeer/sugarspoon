(function() {
  define(function(require) {
    var $, Fixtures, SettingsPanel, TestConfiguration, TestLoader, TestRunner, TestSettings, env, _;
    _ = require('underscore');
    $ = require('jquery');
    TestConfiguration = require('./model/configuration');
    TestSettings = require('./model/settings');
    SettingsPanel = require('./view/settingspanel');
    Fixtures = require('./view/fixtures');
    TestLoader = require('./loader');
    env = require('./env');
    return TestRunner = (function() {
      /*
      The main Sugarspoon testrunner
      
      Provides a public API for running a series of Mocha unit test suites. Actual
      implementation is delegated to either a straight-up Mocha test runner or a
      Blanket coverage runner.
      */

      TestRunner.prototype.views = {};

      function TestRunner(options) {
        if (options == null) {
          options = {};
        }
        this.loader = new TestLoader;
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
        if (env.isHeadless()) {
          this.settings.set({
            coverage: true
          });
        }
        this.views.fixtures = new Fixtures({
          el: '#fixtures',
          model: this.settings
        });
        this.views.settingsPanel = new SettingsPanel({
          model: this.settings
        });
        this.views.settingsPanel.listenTo(this.settings, {
          'change:coverage change:showFixtures': function() {
            return window.location.reload();
          }
        });
        this.loadEngine(options);
      }

      TestRunner.prototype.loadEngine = function(options) {
        /*
        Lazy-load the coverage runner
        
        This prevents BlanketJS from being loaded even if we are not using the
        CoverageRunner.
        */

        var module,
          _this = this;
        this.engineLoaded = new $.Deferred;
        module = './engine/' + (this.settings.get('coverage') ? 'coverage' : 'mocha');
        return require([module], function(Runner) {
          _this.engine = new Runner(options);
          return _this.engineLoaded.resolve();
        });
      };

      TestRunner.prototype.run = function(tests) {
        var _this = this;
        if (tests == null) {
          tests = 'test/main';
        }
        return $.when(this.config.done, this.engineLoaded).then(function() {
          return _this.loader.load(tests).done(function() {
            return _this.engine.run();
          });
        });
      };

      return TestRunner;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/
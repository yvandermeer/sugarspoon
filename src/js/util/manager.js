(function() {
  define(function(require) {
    var $, Backbone, Squire, SystemUnderTest, TestSuiteManager, sinon, _;
    _ = require('underscore');
    $ = require('jquery');
    Backbone = require('backbone');
    sinon = require('sinon');
    Squire = require('squire');
    SystemUnderTest = require('./systemundertest');
    return TestSuiteManager = (function() {
      /*
      Sets up some basic testing tools: Squire and sinon
      */

      TestSuiteManager.forContext = function(context) {
        return new TestSuiteManager(context);
      };

      TestSuiteManager.prototype.contextProperties = ['sandbox', 'injector', 'sys'];

      TestSuiteManager.prototype.namespaces = ['stub', 'util', 'var'];

      function TestSuiteManager(context) {
        this.context = context;
        this._setup();
      }

      TestSuiteManager.prototype._setup = function() {
        this._addNamespacesToContextProperties();
        this.sandbox = sinon.sandbox.create();
        this._instantiateSquire();
        this.sys = new SystemUnderTest(this.injector);
        this._createNamespaces();
        return this._assignContextProperties();
      };

      TestSuiteManager.prototype.beforeEach = function() {
        /*
        The "_" namespace is a special case, because it is reset for each
        individual unit test.
        */

        return this.context._ = {};
      };

      TestSuiteManager.prototype.afterEach = function() {
        delete this.context._;
        return this._resetAllSandboxSpies();
      };

      TestSuiteManager.prototype.teardown = function() {
        var _ref;
        this._removeContextProperties();
        this.sandbox.restore();
        return (_ref = this.injector) != null ? _ref.clean().remove() : void 0;
      };

      TestSuiteManager.prototype._instantiateSquire = function() {
        this.injector = new Squire;
        this.injector.require = _.bind(this.injector.require, this.injector);
        /*
        Avoid loading a duplicate version of jQuery
        
        When a module loaded through Squire requires jQuery and jQuery has already
        been loaded once by RequireJS directly, it would be loaded again by
        Squire. This may cause certain ".. instanceof $" checks to fail. By
        mocking jQuery and returning the original jQuery instance loaded through
        RequireJS, we make sure there is only ever a single instance of jQuery.
        */

        this.injector.mock('jquery', $);
        return this.injector.mock('backbone', Backbone);
      };

      TestSuiteManager.prototype._addNamespacesToContextProperties = function() {
        return this.contextProperties = this.contextProperties.concat(this.namespaces);
      };

      TestSuiteManager.prototype._createNamespaces = function() {
        var ns, _i, _len, _ref, _results;
        _ref = this.namespaces;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ns = _ref[_i];
          _results.push(this[ns] = {});
        }
        return _results;
      };

      TestSuiteManager.prototype._assignContextProperties = function() {
        var property, _i, _len, _ref, _results;
        _ref = this.contextProperties;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          _results.push(this.context[property] = this[property]);
        }
        return _results;
      };

      TestSuiteManager.prototype._resetAllSandboxSpies = function() {
        /*
        Resets the call count of all Sinon spies created through the sandbox
        
        By running this after each individual unit test, we help to minimize
        side-effects between tests.
        */

        var spy, _i, _len, _ref, _results;
        _ref = this.sandbox.fakes || [];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          spy = _ref[_i];
          _results.push(typeof spy.reset === "function" ? spy.reset() : void 0);
        }
        return _results;
      };

      TestSuiteManager.prototype._removeContextProperties = function() {
        var property, _i, _len, _ref, _results;
        _ref = this.contextProperties;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          _results.push(delete this.context[property]);
        }
        return _results;
      };

      return TestSuiteManager;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=manager.js.map
*/
(function() {
  define(function(require) {
    var baseTest, _;
    _ = require('underscore');
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('Test Loader', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            TestLoader: 'sugarspoon/runner/loader'
          });
          return this.sys.load(done);
        });
        before(function() {
          var _this = this;
          this["var"].testModules = {
            'foo': (function() {
              _this.stub.FooModule = function() {
                return {};
              };
              return _this.sandbox.spy(_this.stub, 'FooModule');
            })(),
            'bar': {}
          };
          this.stub.require = function(moduleNames, callback) {
            var modules, name;
            modules = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = moduleNames.length; _i < _len; _i++) {
                name = moduleNames[_i];
                _results.push(this["var"].testModules[name]);
              }
              return _results;
            }).call(_this);
            return callback.apply(null, modules);
          };
          this.sandbox.spy(this.stub, 'require');
          return this.util.loadModules = function() {
            var _ref;
            _this._.loader = new _this.sys.TestLoader({
              require: _this.stub.require
            });
            return (_ref = _this._.loader).load.apply(_ref, arguments);
          };
        });
        describe('loading multiple tests', function() {
          beforeEach(function(done) {
            var moduleNames;
            moduleNames = _(this["var"].testModules).keys();
            return this.util.loadModules(moduleNames, done);
          });
          it('loads the multiple tests using RequireJS', function() {
            return expect(this.stub.require).to.have.been.calledOnce.and.calledWith(_(this["var"].testModules).keys());
          });
          return it('calls the test modules if callable', function() {
            return expect(this.stub.FooModule).to.have.been.calledOnce;
          });
        });
        return describe('loading a single test', function() {
          beforeEach(function(done) {
            this._.moduleName = _(this["var"].testModules).keys()[0];
            return this.util.loadModules(this._.moduleName, done);
          });
          return it('loads that one test using RequireJS', function() {
            return expect(this.stub.require).to.have.been.calledOnce.and.calledWith([this._.moduleName]);
          });
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=loader.js.map
*/
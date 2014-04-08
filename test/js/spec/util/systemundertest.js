(function() {
  define(function(require) {
    var baseTest, _;
    _ = require('underscore');
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('System Under Test', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            SystemUnderTest: 'sugarspoon/util/systemundertest'
          });
          return this.sys.load(done);
        });
        before(function() {
          var _this = this;
          this["var"].moduleMapping = {
            Foo: 'app/foo',
            Bar: 'app/bar'
          };
          this["var"].done = this.sandbox.spy();
          this.stub.FooModule = (function() {
            function FooModule() {}

            return FooModule;

          })();
          this.stub.BarModule = (function() {
            function BarModule() {}

            return BarModule;

          })();
          this.stub.Squire = (function() {
            function Squire() {}

            Squire.prototype.mocks = {};

            Squire.prototype.mock = function() {};

            return Squire;

          })();
          this.sandbox.spy(this.stub.Squire.prototype, 'mock');
          this.stub.requireFn = function(paths, callbackFn) {
            /*
            A simple fake "require" function, hard-wired to callback with
            the two stub modules
            */

            return callbackFn(_this.stub.FooModule, _this.stub.BarModule);
          };
          this.stub.requireFn = this.sandbox.spy(this.stub.requireFn);
          return this.util.createInstance = function(options) {
            if (options == null) {
              options = {};
            }
            if (options.mapping == null) {
              options.mapping = _this["var"].moduleMapping;
            }
            _this._.injector = new _this.stub.Squire;
            _this._.sys = new _this.sys.SystemUnderTest(_this._.injector, _this.stub.requireFn);
            return _this._.sys.define(options.mapping);
          };
        });
        describe('loading the system modules', function() {
          beforeEach(function() {
            this.util.createInstance();
            return this._.sys.load();
          });
          it('loads the modules with the specified require function', function() {
            return expect(this.stub.requireFn).to.have.been.calledOnce.and.calledWith(_(this["var"].moduleMapping).values());
          });
          return it('makes the loaded modules available as properties on itself', function() {
            expect(this._.sys.Foo).to.equal(this.stub.FooModule);
            return expect(this._.sys.Bar).to.equal(this.stub.BarModule);
          });
        });
        describe('mocking modules', function() {
          beforeEach(function() {
            this.util.createInstance();
            return this._.sys.load();
          });
          return it('delegates to the Squire dependency injector', function() {
            var args, _ref, _ref1;
            args = ['app/foo', {}];
            (_ref = this._.sys).mock.apply(_ref, args);
            return (_ref1 = expect(this._.injector.mock).to.have.been.calledOnce.and).calledWithExactly.apply(_ref1, args);
          });
        });
        describe('loading the system modules with a callback', function() {
          beforeEach(function() {
            this.util.createInstance();
            return this._.sys.load(this["var"].done);
          });
          return it('invokes callback when done', function() {
            return expect(this["var"].done).to.have.been.calledOnce;
          });
        });
        return describe('using reserved system module names', function() {
          var reservedWords;
          reservedWords = ['_moduleMapping', '_knownMocks', '_injector', 'define', 'mock', 'load'];
          before(function() {
            return this.util.mappingContainingKey = function(key) {
              var mapping;
              mapping = {
                foo: 'app/foo'
              };
              mapping[key] = 'app/bar';
              return mapping;
            };
          });
          return _(reservedWords).each(function(reservedWord) {
            return it("throws error when using \"" + reservedWord + "\"", function() {
              var _this = this;
              return expect(function() {
                return _this.util.createInstance({
                  mapping: _this.util.mappingContainingKey(reservedWord)
                });
              }).to["throw"](Error);
            });
          });
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=systemundertest.js.map
*/
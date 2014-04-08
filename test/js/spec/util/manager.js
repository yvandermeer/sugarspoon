(function() {
  define(function(require) {
    var $, Backbone, baseTest, _;
    _ = require('underscore');
    $ = require('jquery');
    Backbone = require('backbone');
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('Test Suite Manager', function() {
        baseTest();
        before(function(done) {
          var _this = this;
          this.sys.define({
            TestManager: 'sugarspoon/util/manager'
          });
          this.sys.mock('sinon', (function() {
            _this.stub.SinonSandbox = (function() {
              function SinonSandbox() {}

              SinonSandbox.prototype.restore = function() {};

              return SinonSandbox;

            })();
            _this.stub.sinon = {
              sandbox: {
                create: function() {
                  return _this["var"].sandbox = new _this.stub.SinonSandbox;
                }
              }
            };
            _this.sandbox.spy(_this.stub.sinon.sandbox, 'create');
            _this.sandbox.spy(_this.stub.SinonSandbox.prototype, 'restore');
            return _this.stub.sinon;
          })());
          this.sys.mock('squire', (function() {
            var fn, _i, _len, _ref;
            _this.stub.Squire = (function() {
              function Squire() {}

              Squire.prototype.require = function() {};

              Squire.prototype.clean = function() {
                return this;
              };

              Squire.prototype.remove = function() {};

              Squire.prototype.mock = function() {};

              return Squire;

            })();
            _this.stub.Squire = _this.sandbox.spy(_this.stub.Squire);
            _ref = ['clean', 'remove', 'mock'];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              fn = _ref[_i];
              _this.sandbox.spy(_this.stub.Squire.prototype, fn);
            }
            return _this.stub.Squire;
          })());
          this.sys.mock('sugarspoon/util/systemundertest', (function() {
            _this.stub.SystemUnderTest = (function() {
              function SystemUnderTest() {}

              return SystemUnderTest;

            })();
            _this.stub.SystemUnderTest = _this.sandbox.spy(_this.stub.SystemUnderTest);
            return _this.stub.SystemUnderTest;
          })());
          return this.sys.load(done);
        });
        before(function() {
          var _this = this;
          return this.util.createInstance = function() {
            return _this._.manager = _this.sys.TestManager.forContext(_this["var"].context);
          };
        });
        beforeEach(function() {
          return _(this["var"]).extend({
            context: {}
          });
        });
        afterEach(function() {
          return delete this["var"].context;
        });
        describe('creation', function() {
          beforeEach(function() {
            return this.util.createInstance();
          });
          describe('Sinon sandbox', function() {
            it('is created', function() {
              return expect(this.stub.sinon.sandbox.create).to.have.been.calledOnce;
            });
            it('is available as property on the Test Manager', function() {
              return expect(this._.manager.sandbox).to.equal(this["var"].sandbox);
            });
            return it('is available on the test context', function() {
              return expect(this["var"].context.sandbox).to.equal(this["var"].sandbox);
            });
          });
          describe('Squire dependency injector', function() {
            before(function() {
              var _this = this;
              return this.util.expectMock = function() {
                var _ref;
                return (_ref = expect(_this.stub.Squire.prototype.mock).to.have.been).calledWithExactly.apply(_ref, arguments);
              };
            });
            it('is created', function() {
              return expect(this.stub.Squire).to.have.been.calledOnce;
            });
            it('is available on the Test Manager', function() {
              return expect(this._.manager.injector).to.be["instanceof"](this.stub.Squire);
            });
            it('is available on the test context', function() {
              return expect(this["var"].context.injector).to.equal(this._.manager.injector);
            });
            it('mocks jQuery to avoid duplicate loading', function() {
              return this.util.expectMock('jquery', $);
            });
            return it('mocks Backbone to avoid duplicate loading', function() {
              return this.util.expectMock('backbone', Backbone);
            });
          });
          return describe('System Under Test', function() {
            return it('is created with a reference to the Squire instance', function() {
              return expect(this.stub.SystemUnderTest).to.have.been.calledOnce.and.calledWithExactly(this._.manager.injector);
            });
          });
        });
        return describe('teardown', function() {
          beforeEach(function() {
            this["var"].originalContext = _(this["var"].context).clone();
            this.util.createInstance();
            return this._.manager.teardown();
          });
          it('restores the test context in the original state', function() {
            return expect(this["var"].context).to.deep.equal(this["var"].originalContext);
          });
          it('restores the Sinon sandbox', function() {
            return expect(this["var"].sandbox.restore).to.have.been.calledOnce;
          });
          return it('cleanly removes the Squire dependency injector', function() {
            expect(this._.manager.injector.clean).to.have.been.calledOnce;
            return expect(this._.manager.injector.remove).to.have.been.calledOnce;
          });
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=manager.js.map
*/
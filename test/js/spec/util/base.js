(function() {
  define(function(require) {
    var TestContextInspector, TestManager, baseTest, _;
    _ = require('underscore');
    baseTest = require('sugarspoon/util/base');
    TestManager = require('sugarspoon/util/manager');
    TestContextInspector = require('sugarspoon/util/contextinspector');
    return function() {
      return describe('baseTest utility', function() {
        before(function() {
          TestContextInspector.createFor(this, {
            as: 'contextInspector'
          });
          return this.contextInspector.makeSnapshot('before');
        });
        after(function() {
          return delete this.contextInspector;
        });
        describe('test suite', function() {
          baseTest();
          it('sets up a test manager for the current context', function() {
            expect(this.testManager).to.be.an["instanceof"](TestManager);
            return this._ = {
              foo: 123
            };
          });
          it('cleans up variables on the context after each run', function() {
            var _ref;
            return expect((_ref = this._) != null ? _ref.foo : void 0).to.be.undefined;
          });
          return it('creates a place for storing temporary variables', function() {
            return expect(this._).to.be.ok;
          });
        });
        return describe('after the suite has run', function() {
          it('cleaned up the temporary variable storage', function() {
            return expect(this._).to.be.undefined;
          });
          return it('did not leave behind any extra properties in the context', function() {
            var newProperties;
            this.contextInspector.makeSnapshot('after');
            newProperties = this.contextInspector.compareSnapshots('before', 'after');
            return expect(newProperties).to.deep.equal([]);
          });
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=base.js.map
*/
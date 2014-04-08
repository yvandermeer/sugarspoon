(function() {
  define(function(require) {
    var TestContextInspector;
    TestContextInspector = require('sugarspoon/util/contextinspector');
    return function() {
      return describe('Final sanity check', function() {
        before(function() {
          TestContextInspector.createFor(this, {
            as: 'contextInspector'
          });
          return this.snapshot = this.contextInspector.makeSnapshot('final');
        });
        it('test run has not left behind any extra context properties', function() {
          var finalContext;
          finalContext = this.contextInspector.strayProperties(this.snapshot);
          if (finalContext.length) {
            console.warn("Context properties left behind:          " + (JSON.stringify(finalContext, null, 2)));
          }
          return expect(finalContext).to.deep.equal([]);
        });
        return after(function() {
          delete this.contextInspector;
          return delete this.snapshot;
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=sanitycheck.js.map
*/
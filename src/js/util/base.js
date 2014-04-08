(function() {
  define(function(require) {
    var TestManager, baseTest;
    TestManager = require('./manager');
    return baseTest = function() {
      before(function() {
        return this.testManager = TestManager.forContext(this);
      });
      beforeEach(function() {
        return this.testManager.beforeEach();
      });
      afterEach(function() {
        return this.testManager.afterEach();
      });
      return after(function() {
        this.testManager.teardown();
        return delete this.testManager;
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=base.js.map
*/
(function() {
  define(function(require) {
    var TestRunner, _;
    _ = require('underscore');
    return TestRunner = (function() {
      function TestRunner() {}

      /*
      Base class for custom test runners
      */


      TestRunner.prototype.engine = null;

      TestRunner.prototype.run = function(tests) {
        var _this = this;
        if (_.isString(tests)) {
          tests = [tests];
        }
        return require(tests, function() {
          return _this.engine.run();
        });
      };

      return TestRunner;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=base.js.map
*/
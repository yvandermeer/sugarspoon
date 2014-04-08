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
        if (_(tests).isString()) {
          tests = [tests];
        }
        return require(tests, function() {
          var suite, _i, _len;
          for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            suite = arguments[_i];
            if (typeof suite === "function") {
              suite();
            }
          }
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
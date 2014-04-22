(function() {
  define(function(require) {
    var $, TestLoader, _;
    $ = require('jquery');
    _ = require('underscore');
    return TestLoader = (function() {
      TestLoader.require = null;

      function TestLoader(options) {
        var _ref;
        this.require = (_ref = options != null ? options.require : void 0) != null ? _ref : require;
      }

      TestLoader.prototype.load = function(tests, done) {
        var loading;
        loading = new $.Deferred;
        if (_(tests).isString()) {
          tests = [tests];
        }
        this.require(tests, function() {
          var suite, _i, _len;
          for (_i = 0, _len = arguments.length; _i < _len; _i++) {
            suite = arguments[_i];
            if (typeof suite === "function") {
              suite();
            }
          }
          loading.resolve();
          return typeof done === "function" ? done() : void 0;
        });
        return loading;
      };

      return TestLoader;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=loader.js.map
*/
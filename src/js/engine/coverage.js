(function() {
  define(function(require) {
    var BlanketOptions, CoverageRunner, MochaBlanketAdapter, MochaTestRunner, blanket, env, _;
    _ = require('underscore');
    blanket = require('blanket');
    MochaBlanketAdapter = require('../adapter/mochablanket');
    MochaTestRunner = require('./mocha');
    env = require('../env');
    BlanketOptions = (function() {
      function BlanketOptions() {}

      BlanketOptions.set = function(options) {
        if (options == null) {
          options = {};
        }
        if (_(options).isFunction()) {
          options = options.call(this, env);
        }
        return blanket.options(options);
      };

      return BlanketOptions;

    })();
    return CoverageRunner = (function() {
      function CoverageRunner(options) {
        if (options == null) {
          options = {};
        }
        BlanketOptions.set(options.blanketOptions);
        return new ((function() {
          if (env.isHeadless()) {
            return MochaTestRunner;
          } else {
            return MochaBlanketAdapter;
          }
        })());
      }

      return CoverageRunner;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=coverage.js.map
*/
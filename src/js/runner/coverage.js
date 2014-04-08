(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var CoverageRunner, MochaBlanketAdapter, TestRunner, blanket;
    blanket = require('blanket');
    MochaBlanketAdapter = require('../adapter/mochablanket');
    TestRunner = require('./base');
    return CoverageRunner = (function(_super) {
      __extends(CoverageRunner, _super);

      function CoverageRunner(options) {
        this.setOptions(options.blanketOptions);
        this.engine = new MochaBlanketAdapter;
      }

      CoverageRunner.prototype.setOptions = function(options) {
        if (!options) {
          return;
        }
        return blanket.options(options);
      };

      return CoverageRunner;

    })(TestRunner);
  });

}).call(this);

/*
//@ sourceMappingURL=coverage.js.map
*/
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var CoverageRunner, MochaBlanketAdapter, TestRunner, blanket, mocha;
    blanket = require('blanket');
    mocha = require('mocha');
    MochaBlanketAdapter = require('../adapters/mochablanket');
    TestRunner = require('./base');
    return CoverageRunner = (function(_super) {
      __extends(CoverageRunner, _super);

      function CoverageRunner(baseDir) {
        this.filter = /js-generated\/(?!config.js)(?!test\/)(?!\.\.\/lib\/)(?!\.\.\/js\/)/;
        if (baseDir) {
          this.filter = new RegExp("" + baseDir + "\\/" + this.filter.source);
        }
        blanket.options;
        this.engine = new MochaBlanketAdapter;
      }

      return CoverageRunner;

    })(TestRunner);
  });

}).call(this);

/*
//@ sourceMappingURL=coverage.js.map
*/
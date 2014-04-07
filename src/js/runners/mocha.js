(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var MochaTestRunner, TestRunner;
    TestRunner = require('./base');
    global = this;
    return MochaTestRunner = (function(_super) {
      __extends(MochaTestRunner, _super);

      function MochaTestRunner() {
        this.engine = window.mochaPhantomJS || mocha;
      }

      return MochaTestRunner;

    })(TestRunner);
  });

}).call(this);

/*
//@ sourceMappingURL=mocha.js.map
*/
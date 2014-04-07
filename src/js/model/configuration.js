(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, TestConfiguration, chai;
    $ = require('jquery');
    Backbone = require('backbone');
    chai = require('chai');
    return TestConfiguration = (function(_super) {
      __extends(TestConfiguration, _super);

      TestConfiguration.prototype.chai = chai;

      TestConfiguration.prototype.mocha = mocha;

      TestConfiguration.prototype.defaults = {
        syntax: 'bdd',
        useExpect: true
      };

      function TestConfiguration() {
        this.initialization = new $.Deferred;
        TestConfiguration.__super__.constructor.apply(this, arguments);
      }

      TestConfiguration.prototype.done = function() {
        var _ref;
        return (_ref = this.initialization).done.apply(_ref, arguments);
      };

      TestConfiguration.prototype.initialize = function() {
        var _this = this;
        if (this.configure.length === 0) {
          this.configure();
          return this.initialization.resolve();
        } else {
          return this.configure(function() {
            return _this.initialization.resolve();
          });
        }
      };

      TestConfiguration.prototype.configure = function() {
        this.mocha.setup(this.get('syntax'));
        if (this.get('useExpect')) {
          return window.expect = this.chai.expect;
        }
      };

      return TestConfiguration;

    })(Backbone.Model);
  });

}).call(this);

/*
//@ sourceMappingURL=configuration.js.map
*/
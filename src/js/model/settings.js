(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, Settings, _ref;
    Backbone = require('backbone');
    return Settings = (function(_super) {
      __extends(Settings, _super);

      function Settings() {
        _ref = Settings.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Settings._instance = null;

      Settings.get = function() {
        if (!this._instance) {
          this._instance = new Settings;
        }
        return this._instance;
      };

      Settings.prototype.storageKey = 'g0j0_test_settings';

      Settings.prototype.defaults = {
        showMochaReport: true,
        coverage: true,
        showFixtures: false
      };

      Settings.prototype.initialize = function() {
        this.restoreState();
        return this.on('change', function(model, value, options) {
          return this.persistState();
        });
      };

      Settings.prototype.toggle = function(key) {
        return this.set(key, !this.get(key));
      };

      Settings.prototype.restoreState = function() {
        var state, stateString;
        stateString = window.localStorage.getItem(this.storageKey);
        state = JSON.parse(stateString);
        if (!state) {
          return;
        }
        return this.set(state);
      };

      Settings.prototype.persistState = function() {
        var stateString;
        stateString = JSON.stringify(this);
        return window.localStorage.setItem(this.storageKey, stateString);
      };

      return Settings;

    })(Backbone.Model);
  });

}).call(this);

/*
//@ sourceMappingURL=settings.js.map
*/
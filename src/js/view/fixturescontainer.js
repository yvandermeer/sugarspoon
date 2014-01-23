(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, FixturesContainer, Settings;
    $ = require('jquery');
    Backbone = require('backbone');
    Settings = require('../model/settings');
    return FixturesContainer = (function(_super) {
      __extends(FixturesContainer, _super);

      FixturesContainer.get = function() {
        return this._instance;
      };

      FixturesContainer.createElement = function() {
        /*
        Convenience class method
        */

        var _ref;
        return (_ref = this.get()).createElement.apply(_ref, arguments);
      };

      FixturesContainer.removeView = function(view) {
        if (!Settings.get().get('showFixtures')) {
          return view != null ? view.remove() : void 0;
        }
      };

      function FixturesContainer() {
        FixturesContainer._instance = this;
        FixturesContainer.__super__.constructor.apply(this, arguments);
      }

      FixturesContainer.prototype.initialize = function() {
        this.listenTo(this.model, 'change:showMochaReport', function() {
          return this.renderMochaReport();
        });
        return this.render();
      };

      FixturesContainer.prototype.createElement = function(tagName) {
        if (tagName == null) {
          tagName = 'div';
        }
        /*
        Creates a new child element
        */

        return $("<" + tagName + ">").appendTo(this.$el);
      };

      FixturesContainer.prototype.render = function() {
        $('html').toggleClass('show-fixtures', this.model.get('showFixtures'));
        return this.renderMochaReport();
      };

      FixturesContainer.prototype.renderMochaReport = function() {
        return $('html').toggleClass('hide-mocha-report', !this.model.get('showMochaReport'));
      };

      return FixturesContainer;

    })(Backbone.View);
  });

}).call(this);

/*
//@ sourceMappingURL=fixturescontainer.js.map
*/
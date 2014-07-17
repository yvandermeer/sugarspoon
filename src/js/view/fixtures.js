(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, Fixtures, Settings, _;
    _ = require('underscore');
    $ = require('jquery');
    Backbone = require('backbone');
    Settings = require('../model/settings');
    return Fixtures = (function(_super) {
      __extends(Fixtures, _super);

      Fixtures.get = function() {
        return this._instance;
      };

      Fixtures.createElement = function() {
        /*
        Convenience class method
        */

        var _ref;
        return (_ref = this.get()).createElement.apply(_ref, arguments);
      };

      Fixtures.removeView = function(view) {
        var $subviewRoot;
        if ((view == null) || Settings.get().get('showFixtures')) {
          return;
        }
        if (!_(view.remove).isFunction()) {
          throw new Error('View instance is missing a remove method, ' + 'is it a proper Backbone View?');
        }
        $subviewRoot = view.$el.parentsUntil(this.get().$el).last();
        view.remove();
        return $subviewRoot.remove();
      };

      function Fixtures() {
        Fixtures._instance = this;
        Fixtures.__super__.constructor.apply(this, arguments);
      }

      Fixtures.prototype.initialize = function() {
        if (!this.$el.length) {
          this.setElement($('<div id="fixtures">').insertAfter($('#mocha')));
        }
        this.listenTo(this.model, 'change:showMochaReport', function() {
          return this.renderMochaReport();
        });
        return this.render();
      };

      Fixtures.prototype.createElement = function(tagName) {
        if (tagName == null) {
          tagName = 'div';
        }
        /*
        Creates a new child element
        */

        return $("<" + tagName + ">").appendTo(this.$el);
      };

      Fixtures.prototype.render = function() {
        $('html').toggleClass('show-fixtures', this.model.get('showFixtures'));
        return this.renderMochaReport();
      };

      Fixtures.prototype.renderMochaReport = function() {
        return $('html').toggleClass('hide-mocha-report', !this.model.get('showMochaReport'));
      };

      return Fixtures;

    })(Backbone.View);
  });

}).call(this);

/*
//@ sourceMappingURL=fixtures.js.map
*/
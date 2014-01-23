(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Backbone, Handlebars, SettingsPanel, template, templateString, _ref;
    $ = require('jquery');
    Backbone = require('backbone');
    Handlebars = require('handlebars');
    templateString = '<div>\n    <ul>\n        <li>\n            <label><input type="checkbox" class="showMochaReport"/>mocha report</label>\n        </li>\n\n        <li>\n            <label><input type="checkbox" class="coverage"/>coverage report</label>\n        </li>\n\n        <li>\n            <label><input type="checkbox" class="showFixtures"/>show fixtures</label>\n        </li>\n    </ul>\n</div>';
    template = Handlebars.compile(templateString);
    return SettingsPanel = (function(_super) {
      __extends(SettingsPanel, _super);

      function SettingsPanel() {
        _ref = SettingsPanel.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SettingsPanel.prototype.className = 'settings-panel';

      SettingsPanel.prototype.events = {
        'change input[type=checkbox]': function(e) {
          var $el;
          $el = $(e.currentTarget);
          return this.model.set($el.attr('class'), $el.is(':checked'));
        }
      };

      SettingsPanel.prototype.initialize = function() {
        return this.render();
      };

      SettingsPanel.prototype.render = function() {
        if (!this.$el.parents('body').length) {
          this.$el.html(template({
            settings: this.model.toJSON()
          }));
          this.$el.appendTo($('body'));
        }
        return this.restoreState();
      };

      SettingsPanel.prototype.restoreState = function() {
        var _this = this;
        return this.$('input').each(function(i, el) {
          var $el, settingsAttribute;
          $el = $(el);
          settingsAttribute = $el.attr('class');
          return $el.prop('checked', _this.model.get(settingsAttribute));
        });
      };

      return SettingsPanel;

    })(Backbone.View);
  });

}).call(this);

/*
//@ sourceMappingURL=settingspanel.js.map
*/
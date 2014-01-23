(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var Backbone, SomeView, _ref;
    Backbone = require('backbone');
    return SomeView = (function(_super) {
      __extends(SomeView, _super);

      function SomeView() {
        _ref = SomeView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SomeView.prototype.show = function(textToShow) {
        this.textToShow = textToShow;
        return this.render();
      };

      SomeView.prototype.render = function() {
        return this.$el.css({
          background: 'yellow',
          fontSize: '20px'
        }).text(this.textToShow);
      };

      return SomeView;

    })(Backbone.View);
  });

}).call(this);

/*
//@ sourceMappingURL=someview.js.map
*/
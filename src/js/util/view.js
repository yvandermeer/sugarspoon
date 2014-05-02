(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var Fixtures, ViewTestManager, baseTest, viewTest, _;
    _ = require('underscore');
    Fixtures = require('../view/fixtures');
    baseTest = require('./base');
    ViewTestManager = (function() {
      /*
      Creates view class for use in a Mocha testing context
      */

      ViewTestManager.forContext = function(context, options) {
        return new ViewTestManager(context, options);
      };

      ViewTestManager.prototype.fixtures = Fixtures;

      ViewTestManager.prototype.activeViews = [];

      function ViewTestManager(context, options) {
        this.context = context;
        this.create = __bind(this.create, this);
        this.sandbox = options.sandbox;
      }

      ViewTestManager.prototype.setClass = function(viewClass) {
        this.viewClass = viewClass;
        return this._spyViewMethodIfDefined('render');
      };

      ViewTestManager.prototype.create = function(options) {
        var $el, view;
        if (options == null) {
          options = {};
        }
        if (options["class"]) {
          this.setClass(options["class"]);
        }
        if (!this.viewClass) {
          throw Error('No viewClass defined in ViewTestManager');
        }
        $el = this.fixtures.createElement();
        if (options.html) {
          $el.html(options.html);
        }
        view = new this.viewClass(_({
          el: $el
        }).extend(_(options).omit('html')));
        this.exposeToContext(view);
        return this.activeViews.push(view);
      };

      ViewTestManager.prototype.exposeToContext = function(view) {
        return this.context._.view = view;
      };

      ViewTestManager.prototype.removeActiveViews = function() {
        var view, _i, _len, _ref;
        _ref = this.activeViews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          Fixtures.removeView(view);
        }
        return this.activeViews.length = 0;
      };

      ViewTestManager.prototype._spyViewMethodIfDefined = function(methodName) {
        if (!_(this.viewClass.prototype[methodName]).isFunction()) {
          return;
        }
        return this.sandbox.spy(this.viewClass.prototype, methodName);
      };

      return ViewTestManager;

    })();
    return viewTest = function() {
      baseTest();
      before(function() {
        return this.util.view = ViewTestManager.forContext(this, {
          sandbox: this.sandbox
        });
      });
      return afterEach(function() {
        return this.util.view.removeActiveViews();
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=view.js.map
*/
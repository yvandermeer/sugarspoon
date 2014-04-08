(function() {
  var __slice = [].slice;

  define(function(require) {
    var Snapshot, TestContextInspector, _;
    _ = require('underscore');
    Snapshot = (function() {
      Snapshot.fromContext = function() {
        var args, context;
        context = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Snapshot, [_(context).chain().keys()].concat(__slice.call(args)), function(){});
      };

      function Snapshot(_keys, name) {
        this._keys = _keys;
        this.name = name;
      }

      Snapshot.prototype.getKeys = function(options) {
        var _ref;
        if (options == null) {
          options = {};
        }
        if (options.exclude == null) {
          options.exclude = [];
        }
        return (_ref = this._keys).without.apply(_ref, options.exclude).value();
      };

      return Snapshot;

    })();
    return TestContextInspector = (function() {
      TestContextInspector.mochaProperties = ['_runnable', 'currentTest', 'inspect', 'runnable', 'slow', 'test', 'timeout'];

      TestContextInspector.prototype.whitelist = TestContextInspector.mochaProperties;

      TestContextInspector.createFor = function(context, options) {
        var inspector, propertyName;
        if (options == null) {
          options = {};
        }
        inspector = new TestContextInspector(context);
        if (propertyName = options.as) {
          inspector.addToWhitelist([propertyName]);
          context[propertyName] = inspector;
        }
        return inspector;
      };

      function TestContextInspector(context) {
        this.context = context;
        this._snapshots = {};
      }

      TestContextInspector.prototype.addToWhitelist = function() {
        var names;
        names = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        names = _(names).flatten();
        return this.whitelist = this.whitelist.concat(names);
      };

      TestContextInspector.prototype.makeSnapshot = function(name) {
        var snapshot;
        snapshot = Snapshot.fromContext(this.context, name);
        return this._snapshots[name] = snapshot;
      };

      TestContextInspector.prototype.getSnapshot = function(name) {
        return this._snapshots[name] || (function() {
          throw new TypeError("Unknown shapshot: \"" + name + "\"");
        })();
      };

      TestContextInspector.prototype.strayProperties = function(snapshot) {
        return snapshot.getKeys({
          exclude: this.whitelist
        });
      };

      TestContextInspector.prototype.compareSnapshots = function(a, b) {
        var name, _ref;
        _ref = (function() {
          var _i, _len, _ref, _results;
          _ref = [a, b];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            name = _ref[_i];
            _results.push(this.strayProperties(this.getSnapshot(name)));
          }
          return _results;
        }).call(this), a = _ref[0], b = _ref[1];
        return _.difference(b, a);
      };

      return TestContextInspector;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=contextinspector.js.map
*/
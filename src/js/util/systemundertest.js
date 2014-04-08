(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(function(require) {
    var SystemUnderTest, _;
    _ = require('underscore');
    return SystemUnderTest = (function() {
      SystemUnderTest.prototype._moduleMapping = {};

      SystemUnderTest.prototype._knownMocks = [];

      function SystemUnderTest(_injector, _requireFn) {
        this._injector = _injector;
        this._requireFn = _requireFn;
        this.load = __bind(this.load, this);
        this.define = __bind(this.define, this);
        this.mock = __bind(this.mock, this);
        if (!this._injector) {
          throw new Error('Missing Squire instance');
        }
        if (this._requireFn == null) {
          this._requireFn = require;
        }
        this.reservedKeys = _.keys(this);
        this.reservedKeys.push('_moduleMapping', '_knownMocks');
        this._originalMocks = _(this._injector.mocks).keys();
      }

      SystemUnderTest.prototype.mock = function() {
        var _ref;
        return (_ref = this._injector).mock.apply(_ref, arguments);
      };

      SystemUnderTest.prototype.define = function(mapping) {
        /*
        Defines the system under test
        */

        var hasReservedKeys, invalidKeys,
          _this = this;
        invalidKeys = (function() {
          var keysToBeMapped;
          keysToBeMapped = _(mapping).keys();
          return _(keysToBeMapped).intersection(_this.reservedKeys);
        })();
        hasReservedKeys = invalidKeys.length > 0;
        if (hasReservedKeys) {
          throw new Error("Invalid mapping key(s): " + (JSON.stringify(invalidKeys)));
        }
        return this._moduleMapping = mapping;
      };

      SystemUnderTest.prototype.load = function(done) {
        /*
        Performs the actual loading of the system modules
        
        The loading will be done using either RequireJS or Squire, depending on
        whether any mocking is required.
        */

        var keys, needsMocking, paths, requireFn,
          _this = this;
        paths = _(this._moduleMapping).values();
        keys = _(this._moduleMapping).keys();
        needsMocking = _(this._injector.mocks).chain().keys().difference(this._originalMocks).value().length > 0;
        requireFn = needsMocking ? this._injector.require : this._requireFn;
        return requireFn(paths, function() {
          _(_this).extend(_.object(keys, arguments));
          return typeof done === "function" ? done() : void 0;
        });
      };

      return SystemUnderTest;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=systemundertest.js.map
*/
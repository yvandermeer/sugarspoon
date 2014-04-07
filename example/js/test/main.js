(function() {
  define(function() {
    var module, _i, _len, _ref, _results;
    _ref = ['calculator', 'someview'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      module = _ref[_i];
      _results.push("test/spec/" + module);
    }
    return _results;
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/
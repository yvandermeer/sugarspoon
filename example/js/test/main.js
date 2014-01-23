(function() {
  var test, tests;

  tests = ['calculator'];

  define((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = tests.length; _i < _len; _i++) {
      test = tests[_i];
      _results.push("test/spec/" + test);
    }
    return _results;
  })(), function() {
    var suite, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      suite = arguments[_i];
      _results.push(typeof suite === "function" ? suite() : void 0);
    }
    return _results;
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/
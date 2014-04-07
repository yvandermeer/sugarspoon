(function() {
  define(function(require) {
    var TestRunner, runner, tests;
    TestRunner = require('sugarspoon/main');
    tests = require('test/main');
    runner = new TestRunner({
      coverage: true
    });
    return runner.run(tests);
  });

}).call(this);

/*
//@ sourceMappingURL=runner.js.map
*/
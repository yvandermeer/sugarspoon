(function() {
  define(function(require) {
    var TestRunner, runner;
    TestRunner = require('sugarspoon/main');
    runner = new TestRunner({
      coverage: true
    });
    return runner.run('test/main');
  });

}).call(this);

/*
//@ sourceMappingURL=runner.js.map
*/
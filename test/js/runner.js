(function() {
  define(function(require) {
    var TestRunner, runner, testSuite;
    TestRunner = require('sugarspoon/main');
    testSuite = require('./suite');
    runner = new TestRunner({
      blanketOptions: {
        filter: /\bjs\/src\//
      }
    });
    return runner.run(testSuite);
  });

}).call(this);

/*
//@ sourceMappingURL=runner.js.map
*/
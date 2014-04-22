define (require) ->
  TestRunner = require 'sugarspoon/main'

  testSuite = require './suite'


  runner = new TestRunner
    blanketOptions:
      filter: ///
        \bjs/src/
      ///
  runner.run(testSuite)

define (require) ->
  chaiJQuery = require 'chai-jquery'

  TestRunner = require 'sugarspoon/main'
  BaseTestConfiguration = require 'sugarspoon/model/configuration'

  tests = require 'test/main'


  class TestConfiguration extends BaseTestConfiguration

    configure: ->
      super
      @chai.use(chaiJQuery)

  runner = new TestRunner
    config: new TestConfiguration
    blanketOptions:
      filter: ///
        /app/
      ///
      antifilter: ///
        (?:vendor|spec|src)/
      ///
      branchTracking: false
      debug: true

  runner.run(tests)

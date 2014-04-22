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
    blanketOptions: (env) ->
      options =
        filter: ///
          /app/
        ///
        antifilter: ///
          (?:vendor|spec|src)/
        ///
      if env.isHeadless()
        options.reporter =
            '../../vendor/grunt-blanket-mocha/support/grunt-reporter.js'
      return options

  runner.run(tests)

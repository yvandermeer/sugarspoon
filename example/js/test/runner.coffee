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
    coverage: true

  runner.run(tests)

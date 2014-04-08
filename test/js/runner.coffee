define (require) ->
  sinonChai = require 'sinon-chai'

  TestRunner = require 'sugarspoon/main'
  BaseTestConfiguration = require 'sugarspoon/model/configuration'

  tests = require './main'


  class TestConfiguration extends BaseTestConfiguration

    configure: ->
      super
      @chai.use(sinonChai)


  runner = new TestRunner
    config: new TestConfiguration


  runner.run(tests)

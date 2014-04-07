define (require) ->
  #chaiBackbone = require 'chai-backbone'
  #chaiChanges = require 'chai-changes'
  #sinonChai = require 'sinon-chai'
  #chaiDatetime = require 'chai-datetime'

  TestRunner = require 'sugarspoon/main'

  tests = require 'test/main'

  #BaseTestConfiguration = require 'sugarspoon/model/configuration'


  #class TestConfiguration extends BaseTestConfiguration

    #configure: ->
      #super
      # Chai plugins
      #@chai.use(sinonChai)
      #@chai.use(chaiBackbone)
      #@chai.use(chaiChanges)
      ##@chai.use(chaiJquery)
      #@chai.use(chaiDatetime)

  runner = new TestRunner coverage: true #, config: new TestConfiguration
  runner.run(tests)

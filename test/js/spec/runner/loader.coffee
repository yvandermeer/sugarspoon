define (require) ->
  _ = require 'underscore'
  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'Test Loader', ->
    baseTest()

    before (done) ->
      @sys.define
        TestLoader: 'sugarspoon/runner/loader'
      @sys.load(done)

    before ->
      @var.testModules =
        'foo': do =>
          @stub.FooModule = -> {}
          return @sandbox.spy(@stub, 'FooModule')
        'bar': {}

      @stub.require = (moduleNames, callback) =>
        modules = (@var.testModules[name] for name in moduleNames)
        callback(modules...)
      @sandbox.spy(@stub, 'require')

      @util.loadModules = =>
        @_.loader = new @sys.TestLoader
          # Force the TestLoader to use our stubbed require function
          require: @stub.require
        @_.loader.load(arguments...)


    describe 'loading multiple tests', ->

      beforeEach (done) ->
        moduleNames = _(@var.testModules).keys()
        @util.loadModules(moduleNames, done)

      it 'loads the multiple tests using RequireJS', ->
        expect(@stub.require)
            .to.have.been.calledOnce
            .and.calledWith(_(@var.testModules).keys())

      it 'calls the test modules if callable', ->
        expect(@stub.FooModule).to.have.been.calledOnce


    describe 'loading a single test', ->

      beforeEach (done) ->
        @_.moduleName = _(@var.testModules).keys()[0]
        @util.loadModules(@_.moduleName, done)

      it 'loads that one test using RequireJS', ->
        expect(@stub.require)
            .to.have.been.calledOnce
            .and.calledWith([@_.moduleName])

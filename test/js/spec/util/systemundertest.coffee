define (require) ->
  _ = require 'underscore'

  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'System Under Test', ->
    baseTest()

    before (done) ->
      @sys.define
        SystemUnderTest: 'sugarspoon/util/systemundertest'
      @sys.load(done)

    before ->
      @var.moduleMapping =
        Foo: 'app/foo'
        Bar: 'app/bar'

      @var.done = @sandbox.spy()

      class @stub.FooModule
      class @stub.BarModule
      class @stub.Squire
        mocks: {}
        mock: ->

      @sandbox.spy(@stub.Squire::, 'mock')

      @stub.requireFn = (paths, callbackFn) =>
        ###
        A simple fake "require" function, hard-wired to callback with
        the two stub modules
        ###
        callbackFn(@stub.FooModule, @stub.BarModule)
      @stub.requireFn = @sandbox.spy(@stub.requireFn)

      @util.createInstance = (options = {}) =>
        options.mapping ?= @var.moduleMapping
        @_.injector = new @stub.Squire
        @_.sys = new @sys.SystemUnderTest(@_.injector, @stub.requireFn)
        @_.sys.define(options.mapping)


    describe 'loading the system modules', ->

      beforeEach ->
        @util.createInstance()
        @_.sys.load()

      it 'loads the modules with the specified require function', ->
        expect(@stub.requireFn).to.have.been.calledOnce
          .and.calledWith(_(@var.moduleMapping).values())

      it 'makes the loaded modules available as properties on itself', ->
        expect(@_.sys.Foo).to.equal(@stub.FooModule)
        expect(@_.sys.Bar).to.equal(@stub.BarModule)


    describe 'mocking modules', ->

      beforeEach ->
        @util.createInstance()
        @_.sys.load()

      it 'delegates to the Squire dependency injector', ->
        args = ['app/foo', {}]
        @_.sys.mock(args...)
        expect(@_.injector.mock).to.have.been.calledOnce
            .and.calledWithExactly(args...)


    describe 'loading the system modules with a callback', ->

      beforeEach ->
        @util.createInstance()
        @_.sys.load(@var.done)

      it 'invokes callback when done', ->
        expect(@var.done).to.have.been.calledOnce


    describe 'using reserved system module names', ->

      reservedWords = [
        '_moduleMapping'
        '_knownMocks'
        '_injector'
        'define'
        'mock'
        'load'
      ]

      before ->
        @util.mappingContainingKey = (key) ->
          mapping = {foo: 'app/foo'}
          mapping[key] = 'app/bar'
          return mapping

      _(reservedWords).each (reservedWord) ->
        it "throws error when using \"#{reservedWord}\"", ->
          expect(=> @util.createInstance({mapping:
            @util.mappingContainingKey(reservedWord)})).to.throw(Error)

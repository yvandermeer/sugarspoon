define (require) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'backbone'

  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'Test Suite Manager', ->
    baseTest()

    before (done) ->
      @sys.define
        TestManager: 'sugarspoon/util/manager'

      @sys.mock 'sinon', do =>
        class @stub.SinonSandbox
          restore: ->

        @stub.sinon =
          sandbox:
            create: =>
              @var.sandbox = new @stub.SinonSandbox
        @sandbox.spy(@stub.sinon.sandbox, 'create')
        @sandbox.spy(@stub.SinonSandbox::, 'restore')
        return @stub.sinon

      @sys.mock 'squire', do =>
        class @stub.Squire
          require: ->
          clean: -> return this # allow chaining
          remove: ->
          mock: ->

        @stub.Squire = @sandbox.spy(@stub.Squire) # spy the constructor
        @sandbox.spy(@stub.Squire::, fn) for fn in ['clean', 'remove', 'mock']
        return @stub.Squire

      @sys.mock 'sugarspoon/util/systemundertest', do =>
        class @stub.SystemUnderTest
        @stub.SystemUnderTest = @sandbox.spy(@stub.SystemUnderTest)
        return @stub.SystemUnderTest

      @sys.load(done)

    before ->
      @util.createInstance = =>
        @_.manager = @sys.TestManager.forContext(@var.context)

    beforeEach ->
      _(@var).extend
        context: {}

    afterEach ->
      delete @var.context


    describe 'creation', ->

      beforeEach ->
        @util.createInstance()


      describe 'Sinon sandbox', ->

        it 'is created', ->
          expect(@stub.sinon.sandbox.create).to.have.been.calledOnce

        it 'is available as property on the Test Manager', ->
          expect(@_.manager.sandbox).to.equal(@var.sandbox)

        it 'is available on the test context', ->
          expect(@var.context.sandbox).to.equal(@var.sandbox)


      describe 'Squire dependency injector', ->

        before ->
          @util.expectMock = =>
            expect(@stub.Squire::mock)
                .to.have.been.calledWithExactly(arguments...)

        it 'is created', ->
          expect(@stub.Squire).to.have.been.calledOnce

        it 'is available on the Test Manager', ->
          expect(@_.manager.injector).to.be.instanceof(@stub.Squire)

        it 'is available on the test context', ->
          expect(@var.context.injector).to.equal(@_.manager.injector)

        it 'mocks jQuery to avoid duplicate loading', ->
          @util.expectMock('jquery', $)

        it 'mocks Backbone to avoid duplicate loading', ->
          @util.expectMock('backbone', Backbone)


      describe 'System Under Test', ->

        it 'is created with a reference to the Squire instance', ->
          expect(@stub.SystemUnderTest).to.have.been.calledOnce
              .and.calledWithExactly(@_.manager.injector)


    describe 'teardown', ->

      beforeEach ->
        @var.originalContext = _(@var.context).clone()
        @util.createInstance()
        @_.manager.teardown()

      it 'restores the test context in the original state', ->
        expect(@var.context).to.deep.equal(@var.originalContext)

      it 'restores the Sinon sandbox', ->
        expect(@var.sandbox.restore).to.have.been.calledOnce

      it 'cleanly removes the Squire dependency injector', ->
        expect(@_.manager.injector.clean).to.have.been.calledOnce
        expect(@_.manager.injector.remove).to.have.been.calledOnce

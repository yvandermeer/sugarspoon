define (require) ->
  _ = require 'underscore'

  baseTest = require 'sugarspoon/util/base'
  TestManager = require 'sugarspoon/util/manager'
  TestContextInspector = require 'sugarspoon/util/contextinspector'
  -> \


  describe 'baseTest utility', ->

    before ->
      TestContextInspector.createFor(this, {as: 'contextInspector'})
      @contextInspector.makeSnapshot('before')

    after ->
      delete @contextInspector

    describe 'test suite', ->
      baseTest()

      it 'sets up a test manager for the current context', ->
        expect(@testManager).to.be.an.instanceof(TestManager)
        # Set up some pre-conditions for the next test run
        @_ = {foo: 123}

      it 'cleans up variables on the context after each run', ->
        # Should have been cleaned up from the previous test:
        expect(@_?.foo).to.be.undefined

      it 'creates a place for storing temporary variables', ->
        expect(@_).to.be.ok


    describe 'after the suite has run', ->

      it 'cleaned up the temporary variable storage', ->
        expect(@_).to.be.undefined

      it 'did not leave behind any extra properties in the context', ->
        @contextInspector.makeSnapshot('after')
        newProperties = @contextInspector.compareSnapshots('before', 'after')
        expect(newProperties).to.deep.equal([])

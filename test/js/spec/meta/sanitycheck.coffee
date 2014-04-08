define (require) ->
  TestContextInspector = require 'sugarspoon/util/contextinspector'
  -> \


  describe 'Final sanity check', ->

    before ->
      TestContextInspector.createFor(this, {as: 'contextInspector'})
      @snapshot = @contextInspector.makeSnapshot('final')

    it 'test run has not left behind any extra context properties', ->
      finalContext = @contextInspector.strayProperties(@snapshot)
      console.warn "Context properties left behind:
          #{JSON.stringify(finalContext, null, 2)}" if finalContext.length
      expect(finalContext).to.deep.equal([])

    after ->
      delete @contextInspector
      delete @snapshot

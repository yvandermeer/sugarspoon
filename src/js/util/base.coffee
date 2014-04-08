define (require) ->
  TestManager = require './manager'


  baseTest = ->

    before ->
      @testManager = TestManager.forContext(this)

    beforeEach ->
      @testManager.beforeEach()

    afterEach ->
      @testManager.afterEach()

    after ->
      @testManager.teardown()
      delete @testManager

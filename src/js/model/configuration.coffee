define (require) ->
  $ = require 'jquery'
  Backbone = require 'backbone'
  chai = require 'chai'


  class TestConfiguration extends Backbone.Model

    chai: chai
    mocha: mocha

    defaults:
      syntax: 'bdd'
      useExpect: true

    constructor: ->
      @initialization = new $.Deferred
      super

    done: ->
      @initialization.done(arguments...)

    initialize: ->
      if @configure.length is 0
        @configure()
        @initialization.resolve()
      else
        @configure => @initialization.resolve()

    configure: ->
      # Setup BDD syntax (describe/it)
      @mocha.setup(@get('syntax'))
      # Make "expect()" globally available
      window.expect = @chai.expect if @get('useExpect')

define (require) ->
  Backbone = require 'backbone'


  class Settings extends Backbone.Model

    @_instance: null
    @get: ->
      @_instance = new Settings if not @_instance
      return @_instance

    storageKey: 'sugarspoon_settings'

    defaults:
      showMochaReport: true
      coverage: true
      showFixtures: false

    initialize: ->
      @restoreState()
      @on 'change', (model, value, options) ->
        @persistState()

    toggle: (key) ->
      @set(key, not @get(key))

    restoreState: ->
      stateString = window.localStorage.getItem(@storageKey)
      state = JSON.parse(stateString)
      return unless state
      @set(state)

    persistState: ->
      stateString = JSON.stringify(this)
      window.localStorage.setItem(@storageKey, stateString)

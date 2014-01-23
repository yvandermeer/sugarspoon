define (require) ->
    Backbone = require 'backbone'


    class Settings extends Backbone.Model

        @_instance: null
        @get: ->
            @_instance = new Settings if not @_instance
            return @_instance

        storageKey: 'g0j0_test_settings'

        defaults:
            showMochaReport: true
            coverage: true
            showFixtures: false

        initialize: ->
            # console.warn 'Settings.initialize()'
            @restoreState()
            @on 'change', (model, value, options) -> @persistState()

        toggle: (key) ->
            # console.warn 'Settings.toggle()'
            @set key, not @get(key)

        restoreState: ->
            stateString = window.localStorage.getItem(@storageKey)
            # console.warn 'Settings.restoreState() =>', stateString
            state = JSON.parse(stateString)
            return unless state
            @set state

        persistState: ->
            stateString = JSON.stringify(@)
            # console.warn 'Settings.persistState()', stateString
            window.localStorage.setItem(@storageKey, stateString)

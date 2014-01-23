define (require) ->
    $ = require 'jquery'
    Backbone = require 'backbone'

    Settings = require '../model/settings'


    class FixturesContainer extends Backbone.View

        @get: -> @_instance

        @createElement: ->
            ###
            Convenience class method
            ###
            @get().createElement arguments...

        @removeView: (view) ->
            view?.remove() unless Settings.get().get('showFixtures')

        constructor: ->
            FixturesContainer._instance = @
            super

        initialize: ->
            @listenTo @model, 'change:showMochaReport', -> @renderMochaReport()
            @render()

        createElement: (tagName='div') ->
            ###
            Creates a new child element
            ###
            $("<#{tagName}>").appendTo(@$el)

        render: ->
            # console.warn 'FixturesContainer.render()'
            $('html').toggleClass 'show-fixtures', @model.get('showFixtures')
            @renderMochaReport()

        # TODO (yvdm): separate from FixturesContainer
        renderMochaReport: ->
            $('html').toggleClass 'hide-mocha-report', not @model.get('showMochaReport')


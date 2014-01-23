define (require) ->
    Backbone = require 'backbone'


    class SomeView extends Backbone.View

        show: (@textToShow) ->
            @render()

        render: ->
            @$el.css(background: 'yellow', fontSize: '20px').text(@textToShow)

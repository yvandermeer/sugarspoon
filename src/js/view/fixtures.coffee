define (require) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'backbone'

  Settings = require '../model/settings'


  class Fixtures extends Backbone.View

    @get: -> @_instance

    @createElement: ->
      ###
      Convenience class method
      ###
      @get().createElement(arguments...)

    @removeView: (view) ->
      return if (not view?) or Settings.get().get('showFixtures')
      if not _(view.remove).isFunction()
        throw new Error('View instance is missing a remove method, ' +
            'is it a proper Backbone View?')
      $subviewRoot = view.$el.parentsUntil(@get().$el).last()
      view.remove()
      $subviewRoot.remove()

    constructor: ->
      Fixtures._instance = this
      super

    initialize: ->
      if not @$el.length
        @setElement($('<div id="fixtures">').insertAfter($('#mocha')))
      @listenTo @model, 'change:showMochaReport', ->
        @renderMochaReport()
      @render()

    createElement: (tagName = 'div') ->
      ###
      Creates a new child element
      ###
      $("<#{tagName}>").appendTo(@$el)

    render: ->
      # console.warn 'FixturesContainer.render()'
      $('html').toggleClass('show-fixtures', @model.get('showFixtures'))
      @renderMochaReport()

    # TODO: separate from FixturesContainer
    renderMochaReport: ->
      $('html').toggleClass('hide-mocha-report',
          not @model.get('showMochaReport'))

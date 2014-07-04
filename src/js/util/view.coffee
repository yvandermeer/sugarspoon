define (require) ->
  _ = require 'underscore'

  Fixtures = require '../view/fixtures'
  baseTest = require './base'


  class ViewTestManager
    ###
    Creates view class for use in a Mocha testing context
    ###

    @forContext: (context, options) ->
      return new ViewTestManager(context, options)

    fixtures: Fixtures
    activeViews: []

    constructor: (@context, options) ->
      {sandbox: @sandbox} = options

    setClass: (@viewClass) ->
      @_spyViewMethodIfDefined('render')

    create: (options = {}) =>
      @setClass(options.class) if options.class
      throw Error('No viewClass defined in ViewTestManager') if not @viewClass

      elementSpecified = 'el' of options
      elementCreatedByView = elementSpecified and not options.el

      # If no view element has been specified explicitly, we will create it
      if not elementSpecified
        $el = @fixtures.createElement()
        $el.html(options.html) if options.html

      view = new @viewClass _({el: $el}).extend(_(options).omit('html'))

      # Manually append the element to the Fixtures container if it was created
      # dynamically by the view itself
      if elementCreatedByView
        view.$el.appendTo(@fixtures.get().$el)

      @exposeToContext(view)
      @activeViews.push(view)

    exposeToContext: (view) ->
      @context._.view = view

    removeActiveViews: ->
      Fixtures.removeView(view) for view in @activeViews
      @activeViews.length = 0

    _spyViewMethodIfDefined: (methodName) ->
      return if not _(@viewClass::[methodName]).isFunction()
      @sandbox.spy(@viewClass::, methodName)


  viewTest = ->
    baseTest()

    before ->
      @util.view = ViewTestManager.forContext(this, {sandbox: @sandbox})

    afterEach ->
      @util.view.removeActiveViews()

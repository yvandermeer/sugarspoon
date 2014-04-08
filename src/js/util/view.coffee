define (require) ->
  _ = require 'underscore'
  Fixtures = require 'sugarspoon/view/fixtures'

  baseTest = require 'sugarspoon/util/base'


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
      @sandbox.spy(@viewClass::, 'render')

    create: (options = {}) =>
      @setClass(options.class) if options.class
      throw Error('No viewClass defined in ViewTestManager') if not @viewClass
      $el = @fixtures.createElement()
      $el.html(options.html) if options.html
      view = new @viewClass _({el: $el}).extend(_(options).omit('html'))
      @exposeToContext(view)
      @activeViews.push(view)

    exposeToContext: (view) ->
      @context._.view = view

    removeActiveViews: ->
      Fixtures.removeView(view) for view in @activeViews
      @activeViews.length = 0


  viewTest = ->
    baseTest()

    before ->
      @util.view = ViewTestManager.forContext(this, {sandbox: @sandbox})

    afterEach ->
      @util.view.removeActiveViews()

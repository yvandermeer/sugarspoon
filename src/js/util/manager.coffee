define (require) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'backbone'
  sinon = require 'sinon'
  Squire = require 'squire'

  SystemUnderTest = require './systemundertest'


  class TestSuiteManager
    ###
    Sets up some basic testing tools: Squire and sinon
    ###

    @forContext: (context) ->
      return new TestSuiteManager(context)

    contextProperties: [
      'sandbox'
      'injector'
      'sys'
    ]
    namespaces: [
      'stub'
      'util'
      'var'
    ]
    autoResetSpies: true

    constructor: (@context) ->
      @_setup()

    _setup: ->
      @_addNamespacesToContextProperties()

      @sandbox = sinon.sandbox.create()
      @_instantiateSquire()
      @sys = new SystemUnderTest(@injector) # depends on Squire setup
      @_createNamespaces()
      @_assignContextProperties()

    beforeEach: ->
      ###
      The "_" namespace is a special case, because it is reset for each
      individual unit test.
      ###
      @context._ = {}

    afterEach: ->
      delete @context._
      @resetSandboxSpies() if @autoResetSpies

    teardown: ->
      @_removeContextProperties()
      @sandbox.restore()
      @injector?.clean().remove()

    _instantiateSquire: ->
      @injector = new Squire

      # Allow (new Squire).require() to be passed by reference
      @injector.require = _.bind(@injector.require, @injector)

      ###
      Avoid loading a duplicate version of jQuery

      When a module loaded through Squire requires jQuery and jQuery has already
      been loaded once by RequireJS directly, it would be loaded again by
      Squire. This may cause certain ".. instanceof $" checks to fail. By
      mocking jQuery and returning the original jQuery instance loaded through
      RequireJS, we make sure there is only ever a single instance of jQuery.
      ###
      @injector.mock 'jquery', $

      # Avoid loading duplicate versions of Backbone while we're at it. :-)
      @injector.mock 'backbone', Backbone

    _addNamespacesToContextProperties: ->
      @contextProperties = @contextProperties.concat(@namespaces)

    _createNamespaces: ->
      @[ns] = {} for ns in @namespaces

    _assignContextProperties: ->
      @context[property] = @[property] for property in @contextProperties

    resetSandboxSpies: ->
      ###
      Resets the call count of all Sinon spies created through the sandbox

      By running this after each individual unit test, we help to minimize
      side-effects between tests.
      ###
      spy.reset?() for spy in @sandbox.fakes or []

    _removeContextProperties: ->
      delete @context[property] for property in @contextProperties

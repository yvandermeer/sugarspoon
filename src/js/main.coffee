define (require) ->
  _ = require 'underscore'
  $ = require 'jquery'

  TestConfiguration = require './model/configuration'
  TestSettings = require './model/settings'

  SettingsPanel = require './view/settingspanel'
  Fixtures = require './view/fixtures'

  TestLoader = require './loader'
  env = require './env'


  class TestRunner
    ###
    The main Sugarspoon testrunner

    Provides a public API for running a series of Mocha unit test suites. Actual
    implementation is delegated to either a straight-up Mocha test runner or a
    Blanket coverage runner.
    ###

    views: {}

    constructor: (options = {}) ->
      @loader = new TestLoader

      @config = do ->
        return options.config \
          if options.config instanceof TestConfiguration
        # Support simple config functions without having to create
        # a custom subclass
        if _(options.config).isFunction()
          TestConfiguration::configure = options.config
        return new TestConfiguration

      @settings = TestSettings.get()
      @settings.set(coverage: true) if env.isHeadless()

      @views.fixtures = new Fixtures el: '#fixtures', model: @settings

      @views.settingsPanel = new SettingsPanel model: @settings
      @views.settingsPanel.listenTo @settings,
        'change:coverage change:showFixtures': ->
          window.location.reload()

      @loadEngine(options)

    loadEngine: (options) ->
      ###
      Lazy-load the coverage runner

      This prevents BlanketJS from being loaded even if we are not using the
      CoverageRunner.
      ###
      @engineLoaded = new $.Deferred
      module = './engine/' + if @settings.get('coverage') then 'coverage' \
          else 'mocha'
      require [module], (Runner) =>
        @engine = new Runner options
        @engineLoaded.resolve()

    run: (tests = 'test/main') ->
      $.when(@config.done, @engineLoaded).then =>
        @loader.load(tests).done => @engine.run()

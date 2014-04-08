define (require) ->
  _ = require 'underscore'
  $ = require 'jquery'

  MochaTestRunner = require './runner/mocha'

  TestConfiguration = require './model/configuration'
  TestSettings = require './model/settings'

  SettingsPanel = require './view/settingspanel'
  Fixtures = require './view/fixtures'


  class TestWrapper

    views: {}
    data: {}

    constructor: (options = {}) ->
      @config = do ->
        return options.config \
          if options.config instanceof TestConfiguration
        # Support simple config functions without having to create
        # a custom subclass
        if _(options.config).isFunction()
          TestConfiguration::configure = options.config
        return new TestConfiguration

      @settings = TestSettings.get()
      @views.settingsPanel = new SettingsPanel model: @settings
      @views.settingsPanel.listenTo @settings,
        'change:coverage change:showFixtures': ->
          window.location.reload()

      @views.fixtures = new Fixtures el: '#fixtures', model: @settings

      coverageSupported = not window.mochaPhantomJS
      coverageEnabled = coverageSupported and @settings.get('coverage')

      @runnerLoaded = new $.Deferred
      if coverageEnabled
        # Lazy-load the coverage runner to prevent BlanketJS from being
        # loaded even if we are not using the the CoverageRunner
        require ['./runner/coverage'], (CoverageRunner) =>
          @runner = new CoverageRunner _(options).pick('blanketOptions')
          @runnerLoaded.resolve()
      else
        @runner = new MochaTestRunner
        @runnerLoaded.resolve()

    run: (tests = 'test/main') ->
      $.when(@config.done, @runnerLoaded).then =>
        if not @runner
          console.error 'No test runner defined!'
          return
        @runner.run(tests)

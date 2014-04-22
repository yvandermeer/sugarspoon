define (require) ->
  $ = require 'jquery'
  _ = require 'underscore'


  class TestLoader

    @require: null

    constructor: (options) ->
      # allow overriding the local require function for unit testing purposes
      @require = options?.require ? require

    load: (tests, done) ->
      loading = new $.Deferred

      # Allow passing a single string
      tests = [tests] if _(tests).isString()

      # Load the test modules using RequireJS
      @require tests, ->
        # Help guarantee the order of suite execution
        suite?() for suite in arguments
        loading.resolve()
        done?()

      return loading

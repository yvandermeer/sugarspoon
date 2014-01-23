define (require) ->
    _ = require 'underscore'


    class TestRunner
        ###
        Base class for custom test runners
        ###

        engine: null

        run: (tests) ->
            tests = [tests] if _.isString tests
            require tests, => @engine.run()

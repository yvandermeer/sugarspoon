define (require) ->
    _ = require 'underscore'


    class TestRunner
        ###
        Base class for custom test runners
        ###

        engine: null

        run: (tests) ->
            tests = [tests] if _(tests).isString()
            require tests, => @engine.run()

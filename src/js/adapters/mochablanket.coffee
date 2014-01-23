define (require) ->
    mocha = require 'mocha'
    blanket = require 'blanket'


    class MochaBlanketAdapter

        constructor: ->
            @setupReporter()

            oldRun = mocha.run
            oldCallback = null
            mocha.run = (finishCallback) ->
                oldCallback = finishCallback
                console.log 'waiting for blanket...'

            blanket.beforeStartTestRunner
                bindEvent: (@_startEvent) =>
                callback: ->
                    oldRun(oldCallback)
                    mocha.run = oldRun

        run: ->
            @_startEvent()

        setupReporter: ->
            originalReporter = mocha._reporter

            blanketReporter = (runner) ->
                runner.on 'start', ->
                    blanket.setupCoverage()

                runner.on 'end', ->
                    blanket.onTestsDone()

                runner.on 'suite', ->
                    blanket.onModuleStart()

                runner.on 'test', ->
                    blanket.onTestStart()

                runner.on 'test end', (test) ->
                    blanket.onTestDone test.parent.tests.length, test.state == 'passed'

                # I dont know why these became global leaks
                runner.globals(['stats', 'failures', 'runner'])

                originalReporter(runner)

            mocha.reporter(blanketReporter)

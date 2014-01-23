define (require) ->
    blanket = require 'blanket'
    mocha = require 'mocha'

    MochaBlanketAdapter = require '../adapters/mochablanket'
    TestRunner = require './base'


    class CoverageRunner extends TestRunner

        constructor: (baseDir) ->
            @filter = ///
                js-generated/
                (?!config.js) # Exclude RequireJS config file
                (?!test/) # Exclude the tests themselves
                (?!\.\./lib/)
                (?!\.\./js/)
            ///
            @filter = new RegExp "#{baseDir}\\/#{@filter.source}" if baseDir
            # console.log 'Using filter: ', @filter

            blanket.options
                #filter: @filter
                # branchTracking: true
                # debug: true

            # Things might get slow, especially combined with Squire
            #mocha.timeout(1000 * 6)

            @engine = new MochaBlanketAdapter

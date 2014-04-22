define (require) ->


  class MochaTestRunner

    run: ->
      (window.mochaPhantomJS or window.mocha).run()

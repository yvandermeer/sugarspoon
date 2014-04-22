define (require) ->


  isHeadless: ->
    return !!window.PHANTOMJS

define (require) ->
  Fixtures = require 'sugarspoon/view/fixtures'
  -> \


  describe 'Some View', ->

    before (done) ->
      require ['app/someview'], (@SomeView) => done()

    beforeEach ->
      @view = new @SomeView
        el: Fixtures.createElement()

    afterEach ->
      Fixtures.removeView(@view)

    it 'displays the proper text', ->
      textToShow = 'output of some view'
      @view.show(textToShow)
      expect(@view.$el).to.have.text(textToShow)

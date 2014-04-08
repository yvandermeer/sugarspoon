define (require) ->
  viewTest = require 'sugarspoon/util/view'
  -> \


  describe 'Some View', ->
    viewTest()

    before (done) ->
      @sys.define
        SomeView: 'app/someview'
      @sys.load(done)

    beforeEach ->
      @util.view.create({class: @sys.SomeView})

    it 'displays the proper text', ->
      textToShow = 'output of some view'
      @_.view.show(textToShow)
      expect(@_.view.$el).to.have.text(textToShow)

define (require) ->
    Fixtures = require 'sugarspoon/view/fixtures'
    -> \


    describe 'Some view', ->

        before (done) ->
            require ['someview'], (@SomeView) => done()

        beforeEach ->
            @view = new @SomeView
                el: Fixtures.createElement()

        afterEach ->
            Fixtures.removeView(@view)

        it 'shows something in the DOM', ->
            textToShow = 'output of some view'
            @view.show(textToShow)
            expect(@view.$el.text()).to.equal(textToShow)

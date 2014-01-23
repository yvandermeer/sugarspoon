define (require) ->
    -> \


    describe 'Calculator', ->

        before (done) ->
            require ['calculator'], (@Calculator) => done()

        beforeEach ->
            @calculator = new @Calculator

        describe 'adding one and one', ->

            it 'equals two', ->
                expect(@calculator.add(1, 1)).to.equal(2)

        describe 'subtracting five and two', ->

            it 'equals three', ->
                expect(@calculator.subtract(5, 2)).to.equal(3)

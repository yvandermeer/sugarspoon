define (require) ->
  baseTest = require 'sugarspoon/util/base'
  -> \


  describe 'Calculator', ->
    baseTest()

    before (done) ->
      @sys.define
        Calculator: 'app/calculator'
      @sys.load(done)

    beforeEach ->
      @_.calculator = new @sys.Calculator


    describe 'adding one and one', ->

      it 'equals two', ->
        expect(@_.calculator.add(1, 1)).to.equal(2)


    describe 'subtracting five and two', ->

      it 'equals three', ->
        expect(@_.calculator.subtract(5, 2)).to.equal(3)

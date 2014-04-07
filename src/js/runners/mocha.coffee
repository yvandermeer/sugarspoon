define (require) ->
  mocha = require 'mocha'

  TestRunner = require './base'


  global = this

  class MochaTestRunner extends TestRunner

    constructor: ->
      @engine = window.mochaPhantomJS or mocha

define (require) ->
  blanket = require 'blanket'

  MochaBlanketAdapter = require '../adapter/mochablanket'
  TestRunner = require './base'


  class CoverageRunner extends TestRunner

    constructor: (options = {}) ->
      @setOptions(options.blanketOptions)
      @engine = new MochaBlanketAdapter

    setOptions: (options) ->
      return unless options
      blanket.options(options)

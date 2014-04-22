define (require) ->
  _ = require 'underscore'
  blanket = require 'blanket'

  MochaBlanketAdapter = require '../adapter/mochablanket'
  MochaTestRunner = require './mocha'
  env = require '../env'


  class BlanketOptions

    @set: (options = {}) ->
      if _(options).isFunction()
        options = options.call(this, env)
      blanket.options(options)


  class CoverageRunner

    constructor: (options = {}) ->
      BlanketOptions.set(options.blanketOptions)
      return new do ->
        if env.isHeadless() then MochaTestRunner else MochaBlanketAdapter

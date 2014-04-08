define (require) ->
  _ = require 'underscore'


  class SystemUnderTest

    _moduleMapping: {}
    _knownMocks: []

    constructor: (@_injector, @_requireFn) ->
      throw new Error('Missing Squire instance') if not @_injector

      # allow overriding the local require function for unit testing purposes
      @_requireFn ?= require

      @reservedKeys = _.keys(this)
      @reservedKeys.push('_moduleMapping', '_knownMocks')
      # Remember original mocks
      @_originalMocks = _(@_injector.mocks).keys()

    mock: =>
      @_injector.mock(arguments...)

    define: (mapping) =>
      ###
      Defines the system under test
      ###
      invalidKeys = do =>
        keysToBeMapped = _(mapping).keys()
        return _(keysToBeMapped).intersection(@reservedKeys)
      hasReservedKeys = invalidKeys.length > 0
      throw new Error "Invalid mapping key(s): #{JSON.stringify(invalidKeys)}" \
         if hasReservedKeys
      @_moduleMapping = mapping

    load: (done) =>
      ###
      Performs the actual loading of the system modules

      The loading will be done using either RequireJS or Squire, depending on
      whether any mocking is required.
      ###
      paths = _(@_moduleMapping).values()
      keys = _(@_moduleMapping).keys()

      # Determine whether we should use Squire or if we can simply use the
      # standard RequireJS "local require" call
      needsMocking = _(@_injector.mocks).chain().keys()
          .difference(@_originalMocks).value().length > 0
      requireFn = if needsMocking then @_injector.require else @_requireFn
      #console.warn "Loading using
      #    #{if needsMocking then 'Squire' else 'RequireJS'}"
      requireFn paths, =>
        _(this).extend(_.object(keys, arguments))
        done?()

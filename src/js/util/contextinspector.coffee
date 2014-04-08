define (require) ->
  _ = require 'underscore'


  class Snapshot

    @fromContext: (context, args...) ->
      return new Snapshot(_(context).chain().keys(), args...)

    constructor: (@_keys, @name) ->

    getKeys: (options = {}) ->
      options.exclude ?= []
      return @_keys.without(options.exclude...).value()


  class TestContextInspector

    @mochaProperties: [
      '_runnable'
      'currentTest'
      'inspect'
      'runnable'
      'slow'
      'test'
      'timeout'
    ]
    whitelist: @mochaProperties

    @createFor: (context, options = {}) -> # factory
      inspector = new TestContextInspector(context)
      if propertyName = options.as
        # If we know the name of the context variable that we store ourselves
        # in, we can make sure we add it to the list of "known" properties
        inspector.addToWhitelist([propertyName])
        context[propertyName] = inspector
      return inspector

    constructor: (@context) ->
      @_snapshots = {}

    addToWhitelist: (names...) ->
      names = _(names).flatten()
      @whitelist = @whitelist.concat(names)

    makeSnapshot: (name) ->
      snapshot = Snapshot.fromContext(@context, name)
      @_snapshots[name] = snapshot

    getSnapshot: (name) ->
      return @_snapshots[name] or \
          throw new TypeError("Unknown shapshot: \"#{name}\"")

    strayProperties: (snapshot) ->
      snapshot.getKeys({exclude: @whitelist})

    compareSnapshots: (a, b) ->
      [a, b] = (@strayProperties(@getSnapshot(name)) for name in [a, b])
      return _.difference(b, a)

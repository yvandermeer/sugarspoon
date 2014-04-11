Defining your tests
===================

Sugarspoon provides a [TestRunner][src_testrunner] that loads your test specs using RequireJS and executes `Mocha.run()` when all tests have loaded. 

```coffee
define (require) ->
  TestRunner = require 'sugarspoon/main'

  (new TestRunner).run([
    'spec/some/module'
    'spec/another/module'
  ])
```

A typical test module might look like this:

```coffeescript
# spec/some/module.coffee
define ->
  describe 'Some Module', ->
    it 'does something', ->
      # ...
```

Predictable order of tests
--------------------------

Because the tests are loaded using a single `require()` call, the order in which the tests will run may vary (depending on the order of the asynchronous HTTP responses).

To solve this, Sugarspoon uses the convention that each test module should return a function:

```coffeescript
define ->
  return ->
    describe 'Some Module', ->
```

In CoffeeScript, you could use the following trick to avoid the extra nesting level:
 
```coffeescript
define ->
  -> \
  describe 'Some Module', ->
```

The `TestRunner` will then invoke each function in the original order once all test modules have been loaded.

> If you forget to return a function from your test module, it will still load, but it will likely end up as the very first test suite in the Mocha test runner output, regardless of where you placed it in the list defined in `test/unit/main.coffee`.


Spec file structure
-------------------

You are free to organize your test spec files how you like: put all your tests in a single file, or perhaps mirror the file structure of your application (my personal preference):

```coffeescript
# app/some/module.coffee
define ->
  class SomeModule
    doSomething: ->
      # implementation...

# spec/some/module.coffee
define ->
  describe 'Some Module', ->
    it 'does something', ->
      # verification...
```

If you want, you can define the list of test modules to be loaded in a separate file too:

```coffeescript
define (require) ->
  TestRunner = require 'sugarspoon/main'
  tests = require 'spec/all'

  (new TestRunner).run(tests)
```

```coffeescript
# spec/all.coffee
define ->
  "spec/#{module}" for module in [
    'some/module'
    'another/module'
  ]
]
```

[src_testrunner]: ../src/js/main.coffee

Base test utility functions
===========================

To provide some generic testing behavior, several utility functions are available:

* `baseTest` ([util/base.coffee](https://github.com/yvandermeer/sugarspoon/blob/development/src/js/util/base.coffee))
* `viewTest` ([util/view.coffee](https://github.com/yvandermeer/sugarspoon/blob/development/src/js/util/view.coffee))
* `modelTest` ([util/model.coffee](https://github.com/yvandermeer/sugarspoon/blob/development/src/js/util/model.coffee))
* `collectionTest` ([util/collection.coffee](https://github.com/yvandermeer/sugarspoon/blob/development/src/js/util/collection.coffee))

For testing Backbone Models, Collections and Views, you should use the respective test utility functions. For other modules, simply use `baseTest`.

> The `modelTest()` and `collectionTest()` currently provide the same functionality as the baseTest(), but may be expanded with specific features in the future.


<!--
    * sets up Squire instance as `@injector`
    * sets up a [Sinon sandbox](http://sinonjs.org/docs/#sandbox) under `@sandbox`

    * sets up a `@viewFactory` to facilitate view creation

    * currently has no model-specific functionality

    * currently has no collection-specific functionality
-->

To use a test utility, simply invoke it from within the (top-level) `describe()`:

```coffeescript
describe 'Some Module', ->
  baseTest()

  it '...', ->
```

<a name="utility-basetest"></a>
### `baseTest()`: Generic testing functionality

The `baseTest()` utility function currently has three main features:

1. [Unified API for loading SUT and mocking other modules](#loading-system-modules)
1. [Sinon sandbox for easy spying, stubbing and faking](#common-libraries)
1. [Test context namespacing](#context-namespacing)


<a name="loading-system-modules"></a>
#### Unified API for loading SUT and mocking other modules

An instance of a special `SystemUnderTest` class is created and made available as `@sys` on the test suite context. Loading system modules is a multi-step approach, generally done in an asynchronous `before()` call:

```coffeescript
describe 'Some Module', ->
  baseTest()

  before (done) ->
    # Step 1: define the system being tested in this suite
    # You pass a name-value mapping here; after @sys.load(), the names modules 
    # are available as direct properties on @sys for ease of use.
    @sys.define
      SomeModule: 'some/module' # will be loaded into @sys.SomeModule

    # Step 2 (optional): mock any dependencies you do not wish to exercise
    @sys.mock 'some/dependency', do =>
      class @stub.SomeDependency

    # Step 3: load the actual system
    @sys.load(done)

  it 'exercises the system module', ->
    expect(@sys.SomeModule).to.be.ok
```

Under the hood, `@sys.mock()` delegates to Squire. In `@sys.load()`, the modules are loaded using either Squire or plain RequireJS, depending on if any `@sys.mock()` calls were made.

> The Squire instance being used is available as `@injector`, but you should not need to use it directly. The `baseTest()` automatically calls `@injector.clean()` and `@injector.remove()` (see [Squire docs](https://github.com/iammerrick/Squire.js/#cleanoptional-string-name--array-names)) in the `after()` for the test suite it was called in.

See [Isolate the code under test](#isolate-code-under-test) for more information on mocking using Squire.


<a name="common-libraries"></a>
#### Sinon sandbox for easy spying, stubbing and faking

A [sinon sandbox](http://sinonjs.org/docs/#sandbox) instance is created as `@sandbox`, allowing easy access to the sinon spies, stubs, fake timers and fake server:

```coffeescript
describe 'Some Module', ->
  baseTest()

  it 'stubs and spies some method', ->
    @sandbox.stub window, 'alert', ->
    alert('foo')
    expect(alert).to.have.been.calledOnce

  it 'uses a fake timer', ->
    fakeDate = new Date 1999, 4, 11
    @sandbox.useFakeTimers(fakeDate.getTime()) # party like it's 1999
    expect((new Date).getFullYear()).to.equal(1999)
    @sandbox.clock.restore()
    expect((new Date).getFullYear()).to.equal(2014)

  it 'uses a fake server', (done) ->
    # Start using the fake server, hijacking XHR calls
    expect(@sandbox.server).to.be.undefined
    @sandbox.useFakeServer()
    expect(@sandbox.server).not.to.be.undefined

    # Example XHR through jQuery
    @sandbox.server.respondWith('/foo', 'bar')
    $.get('/foo').done (response) ->
      expect(response).to.equal('bar')
      done()
    @sandbox.server.respond()

    # Restore original XHR
    @sandbox.server.restore()
    expect(@sandbox.server).to.be.undefined
```

To help avoid undesired side-effects between tests, the call counts for any spies created through the Sinon sandbox (e.g. using `@sandbox.spy()` or `@sandbox.stub()`) are automatically reset after each unit test (`it()`).

The `baseTest()` automatically calls `@sandbox.restore()` in the `after()` for the test suite it was called in. Use `@sandbox.clock.restore()` and `@sandbox.server.restore()` if you wish to restore early.


<a name="context-namespacing"></a>
#### Test context namespacing

Using the `TestSuiteManager`, the baseTest() utility helps to ensure that
the side effects of the different test suites (and individual tests)
are kept to a minimum. Three empty namespaces are created and destroyed for
each test suite using baseTest():

* `@stub`: any stubs created in the test
* `@util`: helper functions
* `@var`: strings and other constants used as input and/or verification

These namespaces are made available directly on the Mocha test context
for convenience. Use these namespaces to share behavior between different tests within the suite. They are removed from the test context after the entire suite has run.

> While `@sys` can be considered a namespace as well, you should not assign any properties on it directly.

Additionally, a special `_` namespace is created and reinitialized for each individual unit test (`it()`), helping to avoid side-effects across multiple tests. Use this for instances of the SUT being tested and other values you do not wish to share between individual tests.

> There is a "Final sanity check" unit test which verifies that indeed no properties were left behind on the Mocha test context after all unit tests have run. So if you accidentally forget to properly namespace an context variable (or forget to manually `delete` it afterwards), you will have a final failing unit to remind you.


<a name="utility-viewest"></a>
### `viewTest()`: Testing views

View components typically render HTML content in the browser. Because Mocha tests run in the browser, we can simply use the DOM to test any kind of DOM interaction (e.g. template rendering).

For testing Backbone Views, you should use the `viewTest()` utility function instead of the `baseTest()`:

```coffeescript
describe 'Some View', ->
  viewTest()

  it '...', ->
```

The `viewTest()` "inherits" from `baseTest()`, but provides you with some additional view-specific features:

1. Creates a temporary DOM element to server as your view's `$el`. By default, this is a `<div>` inserted as direct child of a `#fixtures` container
1. Provides an API to instantiate your view: ```@util.view.create({class: @sys.MyViewTest})```. The view is automatically created with the aforementioned `$el` and automatically becomes available in the test context as `@_.view`.
1. Automatically spies the view's `render()` method
1. Removes the view (and its DOM element) `afterEach()` individual test

> The view is only removed if the 'show fixtures' option in the HTML test runner is *unchecked*. Combined with running Mocha tests selectively (using `?grep=`), this allows for rapid isolated development of UI components.

A basic view test might look like this:

```coffeescript
viewTest = require 'sugarspoon/util/view'

describe 'Some View', ->
  viewTest()

  before (done) ->
    @sys.define
      SomeView: 'views/some/view'
    @sys.load(done)

  beforeEach ->
    @util.view.create
      class: @sys.SomeView
      model: do =>
          @stub.model = 
            id: 123
            title: 'some title'

  it 'rendered automatically' ->
    # The render method is automatically set up as a Sinon spy
    expect(@_.view.render).to.have.been.calledOnce

  it 'shows the proper title' ->
    # Use chai-jquery's assertions to inspect the DOM
    expect(@_.view.$el).to.contain(@stub.model.title)
```

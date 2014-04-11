# Testing techniques

Below are a number of specific techniques that can be useful for writing good unit tests.

* [Inspect function/method calls](#inspect-function-calls)
* [Gotcha: spying top-level functions / constructors](#spying-constructors)
* [Isolate the code under test](#isolate-code-under-test)

<a name="inspect-function-calls"></a>
## Inspect function/method calls

To check if a function or method has been called, *without actually changing the implementation*, you should use `sinon.spy()` (see [Sinon documentation](http://sinonjs.org/docs/#sinonspy)):

```coffeescript
sinon.spy(window, 'alert')
alert('hello world') # actually opens an alert
window.alert.callCount # 1
```

Using the [sinon-chai](https://github.com/domenic/sinon-chai) plugin, we can use Chai to assert these "spied calls":

```coffeescript
it 'calls alert', ->
  sinon.spy(window, 'alert')
  expect(window.alert).not.to.have.been.called
  alert('hello world') # actually opens an alert
  expect(window.alert).to.have.been.calledOnce
```

Sometimes, the code to be tested has side effects which you actually want to avoid. The earlier `alert()` is a good example: if the application is supposed to show an alert in certain situations, you would not want to have to dismiss alerts each time you run the test suite that tests that functionality.
For these situations, we use `sinon.stub()` (see [Sinon documentation](http://sinonjs.org/docs/#stubs)). It also implements the stub API, so you use the same assertions:

```coffeescript
it 'calls alert', ->
  sinon.stub(window, 'alert') # just replace sinon.spy() with sinon.stub()
  expect(window.alert).not.to.have.been.called
  alert('hello world') # does NOT open an alert
  expect(window.alert).to.have.been.calledOnce
```

In practice, if you should use the base test utilities (which you should), a Sinon `@sandbox` property is available:


```coffeescript
describe 'Some Module'
  baseTest()

  it 'calls alert', ->
    @sandbox.stub(window, 'alert') # no need to use sinon directly
    expect(window.alert).not.to.have.been.called
    alert('hello world') # does NOT open an alert
    expect(window.alert).to.have.been.calledOnce
```

<a name="spying-constructors"></a>
## Gotcha: spying top-level functions / constructors

When using sinon to spy functions, there is a little gotcha to be aware of: sinon  actually cannot magically "attach" itself onto functions:

```coffeescript
doSomething = ->
sinon.spy(doSomething)
doSomething()
expect(doSomething).to.have.been.calledOnce # TypeError: .. not a spy!
```

Instead, it creates a "wrapped" version of the function. This is why, when spying an object's methods, you define the method to be spied as a string:

```coffeescript
myObject =
  doSomething: ->
sinon.spy(myObject, 'doSomething')
myObject.doSomething()
expect(myObject.doSomething).to.have.been.calledOnce # ok
```

So, to spy a top-level function, you have to assign the result of the spy back onto the variable:

```coffeescript
doSomething = ->
doSomething = sinon.spy(doSomething) # assign the result
doSomething()
expect(doSomething).to.have.been.calledOnce # ok
```

Even then, be aware of references to the original function that may been acquired before the `spy()` call:

```coffeescript
doSomething = ->
ref = doSomething
callIt = -> ref()
doSomething = sinon.spy(doSomething) # returns a wrapped function
callIt() # doesn't call spied function: "ref" still points to the original
expect(doSomething).to.have.been.calledOnce # AssertionError: ... called 0 times
```


<a name="isolate-code-under-test"></a>
## Isolate the code under test

Using RequireJS, you will often find that the SUT has dependencies which are loaded automatically too:

```coffeescript
# SUT: app/appcontroller.coffee
define (require) ->
  SomeView = require 'someview'

  class AppController
    constructor: ->
      @view = new SomeView {color: 'red'}
```

In the above example, when testing `AppController`, we probably want to verify that it instantiates `SomeView` with the correct color, but we probably don't (or *should not*) care about the implementation of `SomeView`, nor would we want to have to deal with any of its side-effects.

```coffeescript
# Test suite: test/spec/appcontroller.coffee
describe 'App Controller', ->
  before (done) ->
    # Also loads "someview"
    require ['appcontroller'], (@AppController) => done()

  it 'creates some view with the correct color', ->
    controller = new @AppController
    # Way too much knowledge about SomeView!
    expect(controller.view.$el.css('color')).to.be.equal('red')
```

By loading the `AppController` module (the module under test) through [Squire](https://github.com/iammerrick/Squire.js/) instead of RequireJS, we can "hijack" the `require` calls made from that module.

Using Squire, we can change the dependencies loaded by the SUT in two ways:

1. Fully replace using `Squire.mock()`
1. Capture using `Squire.store()` and then modify

> Sinon also provides a `sinon.mock()`, not to be confused with `Squire.mock()`. For our purposes, we can ignore it – don't use it.


Both techniques allow spying. Using `Squire.mock()`, you can simply specify a fake class instead of the real one:

```coffeescript
describe 'App Controller', ->
  before (done) ->
    @injector = new Squire
    @injector.mock 'someview', do =>
      # Create our own spied stub for SomeView
      class FakeView
      return @SomeView = sinon.spy(FakeView)
    @injector.require ['appcontroller'], (@AppController) => done()

  it 'creates some view with the correct color', ->
    controller = new @AppController
    expect(@SomeView).to.have.been.calledOnce
      .and.calledWithExactly({color: 'red'})
```

Using `Squire.store()`, the `SomeView` module is loaded as usual, after which we can obtain a reference to it by requiring the special "mocks" module:

```coffeescript
describe 'App Controller', ->
  before (done) ->
    @injector = new Squire
    # Uses the actual SomeView, but stores it so we can inspect it in the require callback
    @injector.store('someview')
    @injector.require ['appcontroller', 'mocks'], (@AppController, mocks) =>
      # mocks.store['someview'] contains the actual SomeView
      done()
```

However, be aware when trying to spy this reference using `sinon.spy()`. While spying methods will work fine...

```coffeescript
@injector.require ['appcontroller', 'mocks'], (@AppController, mocks) =>
  sinon.spy(mocks.store['someview'], 'someMethod')
  done()
```

... spying constructor functions probably does not have the desired effect, because the SUT module will (`appcontroller` in this case) already has a reference to the original function *before* the spy was added.

```coffeescript
@injector.require ['appcontroller', 'mocks'], (@AppController, mocks) =>
  sinon.spy(mocks.store['someview'])
  done()
```

If you really must spy a constructor function like this, without stubbing it, you could still use `Squire.mock()` but then return the original, spied constructor:


```coffeescript
describe 'App Controller', ->
  before (done) ->
    # Store the actual SomeView
    require ['someview'], (@SomeView) => done()

  before (done) ->
    @injector = new Squire
    @injector.mock 'someview', do =>
      # Return the actual SomeView, spied
      @SomeView = sinon.spy(@SomeView)
    @injector.require ['appcontroller'], (@AppController) => done()
```

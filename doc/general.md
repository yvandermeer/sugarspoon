General notes
-------------

<a name="shared-mocha-context"></a>
### Shared Mocha test context

While the Mocha BDD syntax does not use any classes, the same test context is shared across all `describe()`, `before()`, `beforeEach()`, `afterEach()`, `after()` and `it()` calls. This is a powerful feature that can help us re-use data and behavior across different unit tests:

```coffeescript
describe 'Some Module', ->
  beforeEach ->
    @instance = new SomeModule
    @result = @instance.getResult()
  it 'has some property', ->
    expect(@instance.someProperty).to.be.true
  it 'got the expected result', ->
    expect(@result).to.be.ok
```

However, when not cleaned up properly, subsequent tests could fail (or pass when they shouldn't) as a result of test case side effects. See [Clean up and avoid side-effects][doc_side_effects].


<a name="state-vs-behavior-verification"></a>
### State vs. behavior verification

Two general approaches can be identified for testing a module: 

* State verification: click a button, and check if its color changes
* Behavior verification: click a button, and expect the `toggleColor()` method to have been called

For *state verification*, we have the various [Chai assertions](http://chaijs.com/api/assert/). However, in an event-driven environment like a web application, *behavior verification* is actually often more flexible (and in some cases, the only option). Using [Sinon](http://sinonjs.org/), we can actually inspect if certain methods have been invoked, and (optionally), with which arguments.

> When talking about inspecting and isolating code behavior, you may encounter the terms "stub", "mock", "fake" or "dummy". The exact definitions seem to vary depending on who you ask (or which test library you use). For our purposes, we will treat them as synonyms ([even though they are not](http://martinfowler.com/articles/mocksArentStubs.html)).


[doc_side_effects]: best_practices.md#cleanup-side-effects

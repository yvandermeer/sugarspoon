# Best practices

While not everything is strictly related to the Sugarspoon functionality, some of these tips may help to write better unit tests:

* [Load SUT from within the suite](#load-sut-within-suite)
* [Test a single concept per test](#test-single-concept)
* [Use nested suites for scenarios](#use-nested-suites)
* [Name your test cases carefully](#naming-tests)
* [Full code coverage is a minimum](#full-code-coverage)
* [Clean up and avoid side-effects](#cleanup-side-effects)
* [Code Quality: Keep it DRY](#keep-it-dry)
* [Successful tests runs should be silent](#silent-tests)
* [Abstract away asynchronous behavior](#abstract-async-behavior)


<a name="load-sut-within-suite"></a>
## Load SUT from within the suite

Avoid loading the code for the System Under Test from outside the test suites:

```coffeescript
define (require) ->
  # wrong: module is loaded even if the test suite is not executed
  SomeModule = require 'some/module'

  describe 'Some Module', ->
    it 'does the right thing', ->
      expect(new SomeModule).to.be.ok
```

Instead, load the SUT from within the test suite using the `@sys` API set up by the [`baseTest()`](#utility-basetest) utility:

```coffeescript
define (require) ->
  baseTest = require 'sugarspoon/util/base'

  describe 'Some Module', ->
    baseTest()

    before (done) ->
      # right: only loads the module if the 'Some Module' test suite is run
      @sys.define
        SomeModule: 'some/module'
      @sys.load(done)

    it 'does the right thing', ->
      expect(new @sys.SomeModule).to.be.ok
```

This allows for a a clean coverage baseline. **Running an empty suite (e.g. ?grep=xx) should not produce any coverage output**.

Use stubs/mocks to isolate the SUT from its dependencies. See [Isolate the code under test](#isolate-code-under-test).


<a name="test-single-concept"></a>
## Test a single concept per test

A general rule is to have a single `expect()` per test:

```coffeescript
it 'does one thing', ->
  expect(module.doOneThing()).to.be.ok

it 'does another thing', ->
  expect(module.doAnotherThing()).to.be.ok
```

While this is fine as a general rule, even more important is to *test a single concept* per test.

So, instead of writing this:

```coffeescript
describe 'Basket', ->
  it 'adds an item correctly', ->
    basket.addItem({amount: 500})
    expect(basket.length).to.equal(1)
    expect(basket.getTotalAmount()).to.equal(500)
```

Try to split it up like so:

```coffeescript
describe 'Basket', ->
  beforeEach ->
    @basket.addItem({amount: 500})

  it 'updates the number of items'
    expect(@basket.length).to.equal(1)

  it 'calculates the correct total amount', ->
    expect(@basket.getTotalAmount()).to.equal(500)
```

Which leads to the next guideline:


<a name="use-nested-suites"></a>
## Use nested suites for scenarios

The top-level `describe()` for a module often simply names the module. Use nested describes to define scenarios. This also encourages using the `beforeEach()` to set up preconditions for each scenario (see below).

> In terms of [Give-When-Then](http://guide.agilealliance.org/guide/gwt.html), the `beforeEach()` should typically set up the "given, when" pre-condition for the individual tests, with the `it()` actually defining the "then".

So instead of this:

```coffeescript
describe 'Basket', ->
  it 'does one thing when adding an item', -> 
    @util.addItem()
    # assertion...

  it 'does another thing when adding an item', ->
    @util.addItem())
    # assertion...
```

write it like so:

```coffeescript
describe 'Basket', ->
  describe 'adding an item', ->
    beforeEach -> 
      @util.addItem())

    it 'does one thing', ->
      # assertion...

    it 'does another thing', -> 
      # assertion...
```


<a name="naming-tests"></a>
## Name your test cases carefully

When naming your test cases, avoid simply repeating the name of the assertion:

```coffeescript
beforeEach ->
  @_.result = @sys.calculator.add(2, 3)

it 'expects the result to be 5', ->
  expect(@_.result).to.equal(5)
```

Instead, try describing it one abstraction level higher:

```coffeescript
it 'produces the correct sum', ->
  expect(@_.result).to.equal(5)
```


<a name="full-code-coverage"></a>
## Full code coverage is a minimum

A testing code coverage of 100% is not an end goal: it's a minimum requirement. Code not touched by any test can break without anyone noticing. 

> You may argue that some code is too hard to test. This should not be an excuse to not test it – rather, consider changing the design to allow for easier testing.


<a name="cleanup-side-effects"></a>
## Clean up and avoid side-effects

Tests should not depend on being executed in any particular order. Also, each test should be able to be run by itself, and not affect any other tests when run as a full suite.

Spot the problem in this example:

```coffeescript
describe 'Basket'
  before ->
    @basket = new Basket

  it 'calculates the total', ->
    @basket.add(new BasketItem {price: 300})
    expect(@basket.getTotal()).to.equal(300)

  it 'updates the number of items', ->
    @basket.add(new BasketItem {price: 200})
    expect(@basket.getSize()).to.equal(2) # Wrong, depends on previous test!
```

In this example, using `beforeEach()` instead of `before()` solves the problem.
As a general rule, instances should be created inside `beforeEach()` and removed from the context in the `afterEach()`. 

```coffeescript
describe 'Basket'
  beforeEach ->
    @basket = new Basket

  # ...

  afterEach ->
    delete @basket
```

By using the `@_` namespace defined by `baseTest()`, you are ensured of a clean baseline for each test (`@_` is deleted automatically after each test).


```coffeescript
describe 'Basket'
  baseTest()

  beforeEach ->
    @_.basket = new Basket

  # ...
```

<a name="keep-it-dry"></a>
## Code Quality: Keep it DRY
For unit tests, the same code quality standards apply as for regular code: keep it [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) and write clean tests.


<a name="silent-tests"></a>
## Successful tests runs should be silent

Running the unit tests should not produce any errors console output. Use sinon if needed to stub and verify an expected call to `console`.


<a name="abstract-async-behavior"></a>
## Abstract away asynchronous behavior

Avoid repeating asynchronous calls:

```coffeescript
describe 'Loaded module', ->
  it 'has the proper status', (done) ->
    loadModule().finished (result) ->
      expect(result.status).to.be.ok
      done()

  it 'has the proper contents', (done) ->
    loadModule().finished (result) ->
      expect(result.contents).to.equal(expectedContents)
      done()
```

Instead, by introducing an asynchronous `beforeEach()`, we can keep the individual tests nice and simple:

```coffeescript
describe 'Loaded module', ->
  beforeEach (done) ->
    loadModule().finished (@result) => done()

  it 'has the proper status', ->
    expect(@result.status).to.be.ok

  it 'has the proper contents', ->
    expect(@result.contents).to.equal(expectedContents)
```

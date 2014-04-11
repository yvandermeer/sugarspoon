Selective coverage reporting
============================

When running Mocha tests selectively (using the `grep` request parameter), you typically only want to see coverage reports on the modules actually being tested. 

To achieve this, avoid loading the code for the System Under Test from outside the test suites:

```coffeescript
define (require) ->
  # wrong: module is loaded even if the test suite is not executed
  SomeModule = require 'some/module'

  describe 'Some Module', ->
    it 'does the right thing', ->
      expect(new SomeModule).to.be.ok
```

Instead, load the SUT from within the test suite using the `@sys` API provided by the [`baseTest()` utility function][doc_use_utils]:

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

Use stubs/mocks to isolate the SUT from its dependencies. See [Isolate the code under test][doc_isolate_code] for more details.


[doc_use_utils]: ../doc/usage_utility_functions.md#utility-basetest
[doc_isolate_code]: ../doc/techniques.md#isolate-code-under-test

Accurate coverage reporting
===========================

To get accurate coverage reporting using RequireJS when running Mocha tests selectively (using the `grep` request parameter), you should take care to load the code to under test *from within your tests*.

**Wrong**:

```coffee
define (require) ->
  # this will load 'component', even if the test suite below is not run
  MyComponent = require 'component'

  describe 'My component', ->
    it 'does some cool stuff', ->
      (new MyComponent).doSomething()
```


**Right**:

```coffee
define (require) ->

  describe 'My component', ->
    before (done) ->
      require ['component'], (@MyComponent) => done()

    it 'does some cool stuff', ->
      (new @MyComponent).doSomething()
```

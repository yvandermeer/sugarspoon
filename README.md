sugarspoon
==========

Testrunner framework using [RequireJS](http://requirejs.org), [Mocha](http://visionmedia.github.io/mocha/) ([Chai](http://chaijs.com)) and [Blanket.js](http://blanketjs.org)


Features
--------

* **Easy configuration** of Blanket.js with Mocha and AMD (based on the mochablanket adapter provided by Blanket.js)
* **Toggle Blanket.js coverage** with automatic browser reload
* **Persisted test settings** ("mocha report", "coverage report" and "show fixtures") across reloads (using HTML5 local storage)


Background
----------

I wanted to unit test my JavaScript code and optionally have coverage reporting. Although Blanket.js has some separate examples of usage with AMD/RequireJS and Mocha, I found it non-trivial to get the combination to work.

Also, since adding Blanket.js introduces quite a bit of overhead (feels about 2x slower with coverage reporting enabled), I wanted a way to quickly enable or disable coverage in the Mocha web UI.

While I was at it, I also added some extra configuration options to show/hide the detailed Mocha output itself, as well as some very simple HTML fixtures management (Backbone view elements).

Screenshots
-----------

Compared to the standard Mocha HTML output, sugarspoon adds a settings bar at the bottom:

![](doc/assets/coverage-on.png)

Files names in the coverage report can be clicked to show line-based coverage (this is standard Blanket.js):

![](doc/assets/coverage-detail.png)


Installation
------------

    $ bower install sugarspoon


Usage
-----

See the [example](example) directory for details.

Note: to get accurate coverage reporting using RequireJS when running Mocha tests selectively (using the `grep` request parameter), you should take care to load the code to under test *from within your tests*.

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

Changelog
---------

### 0.1.1

* More flexible jQuery dependency in `bower.json`; any 2.x version should be fine.

### 0.1

* First public release; mostly to be considered as proof-of-concept


TODO
----
* Allow for more flexible configuration
* Add support for Jasmine (as alternative to Mocha)
* Test (and add support if necessary) for non-AMD configuration


Credits
-------

Sugarspoon started as part of the [Goeie Jongens](http://goeiejongens.nl/) HTML5 toolkit.

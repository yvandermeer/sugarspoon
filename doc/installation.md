Installation
============

Sugarspoon can be easily installed using [Bower][bower]:

    $ bower install sugarspoon

After installation, you should probably add an entry for sugarspoon in your RequireJS configuration:

```coffee
require.config
  paths:
    # ...
    'sugarspoon': 'path/to/bower_components/sugarspoon/src/js'
```

**NOTE**: Sugarspoon currently depends on RequireJS -- it has not been designed or tested to work without it.

While all code examples in this documentation use CoffeeScript, (and sugarspoon itself was in fact also written in CoffeeScript), Sugarspoon will work equally well with plain JavaScript.

[bower]: http://bower.io

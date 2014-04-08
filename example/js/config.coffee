require.config
  paths: do ->
    root = '../../'
    vendor = "#{root}vendor/"

    'requireLib': "#{vendor}requirejs/require"

    'sugarspoon': "#{root}src/js"

    'backbone': "#{vendor}backbone/backbone"
    'handlebars': "#{vendor}handlebars/handlebars"
    'jquery': "#{vendor}jquery/dist/jquery"
    'underscore': "#{vendor}underscore/underscore"

    # dev
    'blanket': "#{vendor}blanket/dist/qunit/blanket"
    'chai': "#{vendor}chai/chai"
    'chai-jquery': "#{vendor}chai-jquery/chai-jquery"
    'mocha': "#{vendor}mocha/mocha"

    'template': '../handlebars'

  shim:
    'backbone':
      deps: ['underscore', 'jquery']
      exports: 'Backbone'
    'handlebars':
      exports: 'Handlebars'
    'underscore':
      exports: '_'

    # dev
    'blanket':
      exports: 'blanket'
    'mocha':
      exports: 'mocha'

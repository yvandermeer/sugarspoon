require.config
    paths: do ->
        staticPrefix = if require.isBrowser then window._staticUrl \
                else "#{process.env.PROJECT_ROOT}/static/"
        root = '../../'
        vendor = "#{root}vendor/"

        'requireLib': "#{vendor}requirejs/require"

        'sugarspoon': "#{root}src/js"

        'backbone': "#{vendor}backbone/backbone"
        'handlebars': "#{vendor}handlebars/handlebars"
        'jquery': "#{vendor}jquery/jquery"
        'hb': "#{vendor}requirejs-handlebars/hb"
        'text': "#{vendor}requirejs-text/text"
        'underscore': "#{vendor}underscore/underscore"

        # dev
        'blanket': "#{vendor}blanket/dist/qunit/blanket"
        'chai': "#{vendor}chai/chai"
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

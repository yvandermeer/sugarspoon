require.config
    paths: do ->
        staticPrefix = if require.isBrowser then window._staticUrl \
                else "#{process.env.PROJECT_ROOT}/static/"
        lib = '../lib/'

        'requireLib': "#{lib}requirejs/require"

        'backbone': "#{lib}backbone/backbone"
        'handlebars': "#{lib}handlebars/handlebars"
        'hb': "#{lib}requirejs-handlebars/hb"
        'text': "#{lib}requirejs-text/text"
        'underscore': "#{lib}underscore/underscore"

        # dev
        'blanket': "#{lib}blanket/dist/qunit/blanket"
        'chai': "#{lib}chai/chai"
        'mocha': "#{lib}mocha/mocha"

        'template': '../handlebars'

    shim:
        'backbone':
            deps: ['underscore', 'zepto']
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

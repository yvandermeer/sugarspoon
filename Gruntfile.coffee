module.exports = (grunt) ->

    grunt.initConfig do ->
        dirs =
            #javascriptGenerated: "src/js"
            javascript: '{src,example}/js'
        patterns =
            coffeescript: '**/*.coffee'
            javascriptGenerated: "#{dirs.javascriptGenerated}/**/*.js"
            html: "examples/**/*.html"

        pkg: grunt.file.readJSON('package.json')

        coffee:
            options:
                sourceMap: true
            glob_to_multiple:
                expand: true
                flatten: false
                cwd: '.'
                src: ["#{dirs.javascript}/**/*.coffee"]
                dest: '.'
                ext: '.js'

        compass:
            dist:
                options:
                    basePath: 'src'
                    config: 'src/config.rb'

        connect:
            dev:
                options:
                    port: 9001
                    keepalive: true
                    livereload: true

        open:
            all:
                path: 'http://localhost:<%= connect.dev.options.port%>'
                app: 'Google Chrome'

        #uglify:
        #    my_target:
        #        files:
        #            'sugarspoon-min.js': ['sugarspoon.js']

        watch:
            coffee:
                files: [patterns.coffeescript]
                tasks: ['coffee']
                options:
                    nospawn: true
                    livereload: true
            livereload:
                options:
                    livereload: true
                files: [
                    patterns.javascriptGenerated,
                    patterns.html,
                ]

        requirejs:
            compile:
                options: do ->
                    baseUrl = dirs.javascriptGenerated
                    optimize = false

                    baseUrl: baseUrl
                    name: '../../vendor/almond/almond'
                    include: [
                        'spindle/main',
                    ]
                    exclude: [
                        'underscore',
                    ]
                    paths:
                        'underscore': '../../vendor/underscore/underscore'
                    wrap:
                        startFile: 'src/wrap/start.frag'
                        endFile: 'src/wrap/end.frag'
                    out: 'spindle.js'
                    optimize: if optimize then 'uglify2' else 'none'
                    preserveLicenseComments: not optimize

        clean: [dirs.javascriptGenerated]

    # Based on https://github.com/gruntjs/grunt-contrib-watch#compiling-files-as-needed
    changedFiles = Object.create(null)
    onChange = grunt.util._.debounce ->
        filepaths = Object.keys(changedFiles)

        # Selectively compile changed CoffeeScript files
        cwd = grunt.config 'coffee.glob_to_multiple.cwd'
        filepathsRelative = grunt.util._.map filepaths, (s) -> s.replace "#{cwd}/", ''
        grunt.config 'coffee.glob_to_multiple.src', filepathsRelative

        changedFiles = Object.create(null)
    , 200
    grunt.event.on 'watch', (action, filepath) ->
        changedFiles[filepath] = action
        onChange()


    grunt.registerTask 'server', [
        # Open before connect because connect uses keepalive at the moment
        # so anything after connect wouldn't run
        'open',
        'connect',
    ]

    grunt.registerTask 'buildjs', ['clean', 'coffee', 'requirejs']

    grunt.registerTask 'build', ['requirejs', 'uglify']

    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-compass'
    grunt.loadNpmTasks 'grunt-contrib-connect'
    grunt.loadNpmTasks 'grunt-contrib-requirejs'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-open'

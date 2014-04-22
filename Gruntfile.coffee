module.exports = (grunt) ->

  require('time-grunt')(grunt)
  require('jit-grunt')(grunt)


  class FileWatcher

    changedFiles: null

    constructor: (@tasks, options = {}) ->
      options.debounceDelay ?= 200
      @resetChangedFiles()
      @onChange = grunt.util._.debounce(@onChange, options.debounceDelay)

      grunt.event.on 'watch', (action, filepath) =>
        @changedFiles[filepath] = action
        @onChange()

    resetChangedFiles: ->
      @changedFiles = Object.create(null)

    onChange: =>
      changedFilepaths = Object.keys(@changedFiles)
      @limitTaskToFiles(taskName, changedFilepaths) \
          for taskName in @tasks
      @resetChangedFiles()

    limitTaskToFiles: (taskName, filepaths) ->
      filesConfig = "#{taskName}.files.0"
      cwd = grunt.config.get("#{filesConfig}.cwd")
      grunt.config("#{filesConfig}.src", @relativePaths(cwd, filepaths))

    relativePaths: (prefix, filepaths) ->
      prefix += '/'
      return (s.replace(prefix, '') for s in filepaths \
          when s.indexOf(prefix) is 0)


  new FileWatcher ['coffee.src', 'coffee.test', 'coffee.example']


  grunt.initConfig do ->
    dirs =
      javascript: '{src,test}/js'
      example: 'example/js'
    patterns =
      coffeescript: '**/*.coffee'
      javascript: '**/*.js'
      jsGenerated: '**/*.{js,js.map}'
      html: 'example/**/*.html'

    pkg: grunt.file.readJSON('package.json')

    coffee:
      src:
        files: [
          expand: true
          cwd: 'src/js'
          src: patterns.coffeescript
          dest: 'src/js'
          ext: '.js'
        ]
        options:
          sourceMap: true

      test:
        files: [
          expand: true
          cwd: 'test/js'
          src: patterns.coffeescript
          dest: 'test/js'
          ext: '.js'
        ]
        options:
          sourceMap: true

      example:
        files: [
          expand: true
          cwd: 'example/js'
          src: patterns.coffeescript
          dest: 'example/js'
          ext: '.js'
        ]
        options:
          sourceMap: true

    coffeelint:
      options: grunt.file.readJSON('coffeelint.json')
      app: ["#{dirs.javascript}/#{patterns.coffeescript}"]

    mocha:
      calculator:
        options:
          urls: ['http://localhost:9001/example/']
          # don't run automatically, because we use AMD
          # and call Mocha.run() ourselves
          run: false
          log: true
          reporter: 'Dot'

    blanket_mocha:
      dev:
        options:
          urls: ['http://localhost:9001/example/']
          run: false
          threshold: 85
          moduleThreshold: 100
          modulePattern: 'js/app/(.+)\.js'
          log: true

    compass:
      dist:
        options:
          basePath: 'src'
          config: 'src/config.rb'

    connect:
      dev:
        options:
          port: 9000
          livereload: true

      unittest:
        options:
          port: 9001
          livereload: true

    watch:
      options:
        livereload: true

      coffee_src:
        options:
          spawn: false
        files: ["src/js/#{patterns.coffeescript}"]
        tasks: ['coffee:src']

      coffee_test:
        options:
          spawn: false
        files: ["test/js/#{patterns.coffeescript}"]
        tasks: ['coffee:test']

      coffee_example:
        options:
          spawn: false
        files: ["#{dirs.example}/#{patterns.coffeescript}"]
        tasks: ['coffee:example']

      livereload:
        files: [
          "#{dirs.javascript}/#{patterns.javascript}"
          "#{dirs.example}/#{patterns.javascript}"
          patterns.html
        ]

    clean: [
      "#{dirs.javascript}/#{patterns.jsGenerated}"
      "example/js/#{patterns.jsGenerated}"
    ]


  grunt.registerTask 'server', [
    'clean'
    'coffee'
    'connect:dev',
    'watch',
  ]

  grunt.registerTask 'build', ['clean', 'coffee']

  grunt.registerTask 'test', 'Run unit tests command-line.', (blanket) ->
    grunt.task.run [
      'coffee'
      'connect:unittest'
      "#{if blanket is 'blanket' then 'blanket_' else ''}mocha"
    ]

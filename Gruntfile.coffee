module.exports = (grunt) ->

  grunt.initConfig do ->
    dirs =
      #javascriptGenerated: "src/js"
      javascript: '{src,example,test}/js'
    patterns =
      coffeescript: '**/*.coffee'
      javascriptGenerated: "#{dirs.javascriptGenerated}/**/*.js"
      html: 'examples/**/*.html'

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

    coffeelint:
      options: grunt.file.readJSON('coffeelint.json')
      app: ["#{dirs.javascript}/**/*.coffee"]

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

    clean: ["#{dirs.javascript}/**/*.{js,js.map}"]

  # Based on:
  # https://github.com/gruntjs/grunt-contrib-watch#compiling-files-as-needed
  changedFiles = Object.create(null)
  onChange = grunt.util._.debounce ->
    filepaths = Object.keys(changedFiles)

    # Selectively compile changed CoffeeScript files
    cwd = grunt.config 'coffee.glob_to_multiple.cwd'
    filepathsRelative = grunt.util._.map filepaths, (s) ->
      s.replace "#{cwd}/", ''
    grunt.config 'coffee.glob_to_multiple.src', filepathsRelative

    changedFiles = Object.create(null)
  , 200
  grunt.event.on 'watch', (action, filepath) ->
    changedFiles[filepath] = action
    onChange()


  grunt.registerTask 'server', [
    'connect',
  ]

  grunt.registerTask 'build', ['clean', 'coffee']

  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'

define (require) ->
  _ = require 'underscore'
  $ = require 'jquery'
  Backbone = require 'backbone'
  Handlebars = require 'handlebars'


  templateString = '''
    <div>
      <ul>
        <li>
          <label><input type="checkbox" class="showMochaReport"/>
            mocha report</label>
        </li>

        <li>
          <label><input type="checkbox" class="coverage"/>
            coverage report</label>
        </li>

        <li>
          <label><input type="checkbox" class="showFixtures"/>
            show fixtures</label>
        </li>
      </ul>
    </div>
  '''
  template = Handlebars.compile(templateString)


  class SettingsPanel extends Backbone.View

    className: 'settings-panel'

    events:
      'change input[type=checkbox]': (e) ->
        $el = $(e.currentTarget)
        @model.set($el.attr('class'), $el.is(':checked'))

    initialize: ->
      @render()

    render: ->
      if not @$el.parents('body').length
        @renderTemplate()
        @$el.appendTo $('body')
      @restoreState()

    renderTemplate: ->
      context = _(@).result('templateContext')
      @$el.html(template(context))

    templateContext: ->
      settings: @model.toJSON()

    restoreState: ->
      @$('input').each (i, el) =>
        $el = $(el)
        settingsAttribute = $el.attr('class')
        $el.prop('checked', @model.get(settingsAttribute))

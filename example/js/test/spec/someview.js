(function() {
  define(function(require) {
    var Fixtures;
    Fixtures = require('sugarspoon/view/fixtures');
    return function() {
      return describe('Some View', function() {
        before(function(done) {
          var _this = this;
          return require(['app/someview'], function(SomeView) {
            _this.SomeView = SomeView;
            return done();
          });
        });
        beforeEach(function() {
          return this.view = new this.SomeView({
            el: Fixtures.createElement()
          });
        });
        afterEach(function() {
          return Fixtures.removeView(this.view);
        });
        return it('displays the proper text', function() {
          var textToShow;
          textToShow = 'output of some view';
          this.view.show(textToShow);
          return expect(this.view.$el).to.have.text(textToShow);
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=someview.js.map
*/
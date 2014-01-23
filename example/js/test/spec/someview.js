(function() {
  define(function(require) {
    var Fixtures;
    Fixtures = require('sugarspoon/view/fixtures');
    return function() {
      return describe('Some view', function() {
        before(function(done) {
          var _this = this;
          return require(['someview'], function(SomeView) {
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
        return it('shows something in the DOM', function() {
          var textToShow;
          textToShow = 'output of some view';
          this.view.show(textToShow);
          return expect(this.view.$el.text()).to.equal(textToShow);
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=someview.js.map
*/
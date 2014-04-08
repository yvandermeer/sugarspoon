(function() {
  define(function(require) {
    var viewTest;
    viewTest = require('sugarspoon/util/view');
    return function() {
      return describe('Some View', function() {
        viewTest();
        before(function(done) {
          this.sys.define({
            SomeView: 'app/someview'
          });
          return this.sys.load(done);
        });
        beforeEach(function() {
          return this.util.view.create({
            "class": this.sys.SomeView
          });
        });
        return it('displays the proper text', function() {
          var textToShow;
          textToShow = 'output of some view';
          this._.view.show(textToShow);
          return expect(this._.view.$el).to.have.text(textToShow);
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=someview.js.map
*/
(function() {
  define(function(require) {
    var baseTest;
    baseTest = require('sugarspoon/util/base');
    return function() {
      return describe('Calculator', function() {
        baseTest();
        before(function(done) {
          this.sys.define({
            Calculator: 'app/calculator'
          });
          return this.sys.load(done);
        });
        beforeEach(function() {
          return this._.calculator = new this.sys.Calculator;
        });
        describe('adding one and one', function() {
          return it('equals two', function() {
            return expect(this._.calculator.add(1, 1)).to.equal(2);
          });
        });
        return describe('subtracting five and two', function() {
          return it('equals three', function() {
            return expect(this._.calculator.subtract(5, 2)).to.equal(3);
          });
        });
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=calculator.js.map
*/
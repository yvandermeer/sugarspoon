(function() {
  define(function(require) {
    return describe('Calculator', function() {
      before(function(done) {
        var _this = this;
        return require(['calculator'], function(Calculator) {
          _this.Calculator = Calculator;
          return done();
        });
      });
      beforeEach(function() {
        return this.calculator = new this.Calculator;
      });
      describe('adding one and one', function() {
        return it('equals two', function() {
          return expect(this.calculator.add(1, 1)).to.equal(2);
        });
      });
      return describe('subtracting five and two', function() {
        return it('equals three', function() {
          return expect(this.calculator.subtract(5, 2)).to.equal(3);
        });
      });
    });
  });

}).call(this);

/*
//@ sourceMappingURL=calculator.js.map
*/
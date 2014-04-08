(function() {
  define(function(require) {
    var Calculator;
    return Calculator = (function() {
      function Calculator() {}

      Calculator.prototype.add = function(a, b) {
        return a + b;
      };

      Calculator.prototype.subtract = function(a, b) {
        return a - b;
      };

      return Calculator;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=calculator.js.map
*/
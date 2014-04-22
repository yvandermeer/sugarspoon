(function() {
  define(function(require) {
    var MochaTestRunner;
    return MochaTestRunner = (function() {
      function MochaTestRunner() {}

      MochaTestRunner.prototype.run = function() {
        return (window.mochaPhantomJS || window.mocha).run();
      };

      return MochaTestRunner;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=mocha.js.map
*/
(function() {
  define(function(require) {
    var baseTest, modelTest;
    baseTest = require('./base');
    return modelTest = function() {
      return baseTest();
    };
  });

}).call(this);

/*
//@ sourceMappingURL=model.js.map
*/
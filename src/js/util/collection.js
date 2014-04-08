(function() {
  define(function(require) {
    var baseTest, collectionTest;
    baseTest = require('./base');
    return collectionTest = function() {
      return baseTest();
    };
  });

}).call(this);

/*
//@ sourceMappingURL=collection.js.map
*/
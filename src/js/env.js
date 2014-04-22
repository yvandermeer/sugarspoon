(function() {
  define(function(require) {
    return {
      isHeadless: function() {
        return !!window.PHANTOMJS;
      }
    };
  });

}).call(this);

/*
//@ sourceMappingURL=env.js.map
*/
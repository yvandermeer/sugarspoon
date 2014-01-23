(function() {
  define(function(require) {
    var MochaBlanketAdapter, blanket, mocha;
    mocha = require('mocha');
    blanket = require('blanket');
    return MochaBlanketAdapter = (function() {
      function MochaBlanketAdapter() {
        var oldCallback, oldRun,
          _this = this;
        this.setupReporter();
        oldRun = mocha.run;
        oldCallback = null;
        mocha.run = function(finishCallback) {
          oldCallback = finishCallback;
          return console.log('waiting for blanket...');
        };
        blanket.beforeStartTestRunner({
          bindEvent: function(_startEvent) {
            _this._startEvent = _startEvent;
          },
          callback: function() {
            oldRun(oldCallback);
            return mocha.run = oldRun;
          }
        });
      }

      MochaBlanketAdapter.prototype.run = function() {
        return this._startEvent();
      };

      MochaBlanketAdapter.prototype.setupReporter = function() {
        var blanketReporter, originalReporter;
        originalReporter = mocha._reporter;
        blanketReporter = function(runner) {
          runner.on('start', function() {
            return blanket.setupCoverage();
          });
          runner.on('end', function() {
            return blanket.onTestsDone();
          });
          runner.on('suite', function() {
            return blanket.onModuleStart();
          });
          runner.on('test', function() {
            return blanket.onTestStart();
          });
          runner.on('test end', function(test) {
            return blanket.onTestDone(test.parent.tests.length, test.state === 'passed');
          });
          runner.globals(['stats', 'failures', 'runner']);
          return originalReporter(runner);
        };
        return mocha.reporter(blanketReporter);
      };

      return MochaBlanketAdapter;

    })();
  });

}).call(this);

/*
//@ sourceMappingURL=mochablanket.js.map
*/
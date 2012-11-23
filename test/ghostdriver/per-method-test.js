var desired, remoteWdConfig, test, _ref;

_ref = require('./config'); 
desired = _ref.desired; 
remoteWdConfig = _ref.remoteWdConfig;

test = require('../common/per-method-test-base').test;

describe("wd", function() {
  return describe("ghostdriver", function() {
    return describe("per method tests", function() {
      return describe("using ghostdriver", function() {
        return test(remoteWdConfig, desired);
      });
    });
  });
});

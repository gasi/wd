var Express, async, should, test, wd;

should = require('should');

async = require('async');

Express = require('./express').Express;

wd = require('./wd-with-cov');

test = function(remoteWdConfig, desired) {
  var browser, browserName, express, frames, handles, refreshPage;
  browser = null;
  handles = {};
  browserName = desired? desired.browserName : undefined;
  express = new Express();
  before(function(done) {
    express.start();
    return done(null);
  });
  after(function(done) {
    express.stop();
    return done(null);
  });
  describe("wd.remote", function() {
    return it("should create browser", function(done) {
      browser = wd.remote(remoteWdConfig);
      if (!process.env.WD_COV) {
        browser.on("status", function(info) {
          return console.log("\u001b[36m%s\u001b[0m", info);
        });
        browser.on("command", function(meth, path) {
          return console.log(" > \u001b[33m%s\u001b[0m: %s", meth, path);
        });
      }
      return done(null);
    });
  });
  describe("init", function() {
    return it("should initialize browserinit", function(done) {
      this.timeout(30000);
      return browser.init(desired, function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("opening first window", function() {
    return it("should open the first window", function(done) {
      this.timeout(10000);
      return browser.get("http://127.0.0.1:8181/window-test-page.html?window_num=1", function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("setting first window name", function() {
    return it("should set the window name", function(done) {
      return browser.execute("window.name='window-1'", function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("retrieving first window name", function() {
    return it("should be window-1", function(done) {
      return browser.windowName(function(err, name) {
        should.not.exist(err);
        name.should.equal('window-1');
        return done(null);
      });
    });
  });
  describe("retrieving first window handle", function() {
    return it("should retrieve handle", function(done) {
      return browser.windowHandle(function(err, handle) {
        should.not.exist(err);
        should.exist(handle);
        handle.length.should.be.above(0);
        handles['window-1'] = handle;
        return done(null);
      });
    });
  });
  describe("opening second window", function() {
    return it("should open the second window", function(done) {
      this.timeout(10000);
      return browser.newWindow('http://127.0.0.1:8181/window-test-page.html?window_num=2', 'window-2', function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("change focus to second window", function() {
    return it("should focus on second window", function(done) {
      return browser.window('window-2', function(err) {
        should.not.exist(err);
        return browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-2');
          return done(null);
        });
      });
    });
  });
  describe("retrieving second window handle", function() {
    return it("should retrieve handle", function(done) {
      return browser.windowHandle(function(err, handle) {
        should.not.exist(err);
        should.exist(handle);
        handle.length.should.be.above(0);
        handle.should.not.equal(handles['window-1']);
        handles['window-2'] = handle;
        return done(null);
      });
    });
  });
  describe("opening third window", function() {
    return it("should open the third window", function(done) {
      this.timeout(10000);
      return browser.newWindow('http://127.0.0.1:8181/window-test-page.html?window_num=3', 'window-3', function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("change focus to third window", function() {
    return it("should focus on third window", function(done) {
      return browser.window('window-3', function(err) {
        should.not.exist(err);
        return browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-3');
          return done(null);
        });
      });
    });
  });
  describe("retrieving third window handle", function() {
    return it("should retrieve handle", function(done) {
      return browser.windowHandle(function(err, handle) {
        should.not.exist(err);
        should.exist(handle);
        handle.length.should.be.above(0);
        handle.should.not.equal(handles['window-1']);
        handle.should.not.equal(handles['window-2']);
        handles['window-3'] = handle;
        return done(null);
      });
    });
  });
  describe("windowHandles", function() {
    return it("should retrieve 2 window handles", function(done) {
      return browser.windowHandles(function(err, _handles) {
        var k, v, _i, _len;
        should.not.exist(err);
        _handles.should.have.length(3);
        for (v = _i = 0, _len = handles.length; _i < _len; v = ++_i) {
          k = handles[v];
          _handles.should.include(v);
        }
        return done(null);
      });
    });
  });
  describe("change focus to second window using window handle", function() {
    return it("should focus on second window", function(done) {
      return browser.window(handles['window-2'], function(err) {
        should.not.exist(err);
        return browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-2');
          return done(null);
        });
      });
    });
  });
  describe("closing second window", function() {
    return it("should close the second window", function(done) {
      return browser.close(function(err) {
        should.not.exist(err);
        return browser.windowHandles(function(err, _handles) {
          should.not.exist(err);
          _handles.should.have.length(2);
          return done(null);
        });
      });
    });
  });
  describe("change focus to third window", function() {
    return it("should focus on third window", function(done) {
      return browser.window('window-3', function(err) {
        should.not.exist(err);
        return browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-3');
          return done(null);
        });
      });
    });
  });
  describe("closing third window", function() {
    return it("should close the third window", function(done) {
      return browser.close(function(err) {
        should.not.exist(err);
        return browser.windowHandles(function(err, _handles) {
          should.not.exist(err);
          _handles.should.have.length(1);
          return done(null);
        });
      });
    });
  });
  describe("change focus to first window", function() {
    return it("should focus on first window", function(done) {
      return browser.window('window-1', function(err) {
        should.not.exist(err);
        return browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-1');
          return done(null);
        });
      });
    });
  });
  describe("opening window with no name", function() {
    return it("should open the third window", function(done) {
      this.timeout(10000);
      return browser.newWindow('http://127.0.0.1:8181/window-test-page.html?window_num=4', function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  describe("focusing on window with no name handle", function() {
    return it("last handle should correspond to latest opened window", function(done) {
      return browser.windowHandles(function(err, _handles) {
        should.not.exist(err);
        _handles.should.have.length(2);
        return browser.window(_handles[1], function(err) {
          should.not.exist(err);
          return browser.url(function(err, url) {
            url.should.include("num=4");
            return done(null);
          });
        });
      });
    });
  });
  describe("closing window with no name", function() {
    return it("should close the window with no name", function(done) {
      return browser.close(function(err) {
        should.not.exist(err);
        return browser.windowHandles(function(err, _handles) {
          should.not.exist(err);
          _handles.should.have.length(1);
          return done(null);
        });
      });
    });
  });
  describe("change focus to first window", function() {
    return it("should focus on first window", function(done) {
      return browser.window('window-1', function(err) {
        should.not.exist(err);
        return browser.windowName(function(err, name) {
          should.not.exist(err);
          name.should.equal('window-1');
          return done(null);
        });
      });
    });
  });
  describe("opening frame test page", function() {
    return it("should open the first window", function(done) {
      this.timeout(10000);
      return browser.get("http://127.0.0.1:8181/frames/index.html", function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  frames = [];
  describe("looking for frame elements", function() {
    return it("should find frame elements", function(done) {
      return browser.elementsByTagName('frame', function(err, _frames) {
        should.not.exist(err);
        _frames.should.have.length(3);
        return async.forEachSeries(_frames, function(frame, done) {
          var frameInfo;
          frameInfo = {
            el: frame.toString()
          };
          return async.series([
            function(done) {
              return frame.getAttribute('name', function(err, name) {
                should.not.exist(err);
                frameInfo.name = name;
                return done(null);
              });
            }, function(done) {
              return frame.getAttribute('id', function(err, id) {
                should.not.exist(err);
                frameInfo.id = id;
                return done(null);
              });
            }
          ], function(err) {
            should.not.exist(err);
            frames.push(frameInfo);
            return done(null);
          });
        }, function(err) {
          var i;
          should.not.exist(err);
          frames.should.have.length(3);
          ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = frames.length; _i < _len; _i++) {
              i = frames[_i];
              _results.push(i.name);
            }
            return _results;
          })()).should.eql(['menu', 'main', 'bottom']);
          return done(null);
        });
      });
    });
  });
  refreshPage = function() {
    // selenium is very buggy, so having to refresh between each
    // frame switch
    return describe("refreshing page", function() {
      return it("should refresh the page", function(done) {
        return browser.refresh(function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  };
  describe("selecting default frame", function() {
    return it("should select frame menu", function(done) {
      return browser.frame(function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  refreshPage();
  describe("selecting frame by number", function() {
    return it("should select frame menu", function(done) {
      return browser.frame(0, function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
  refreshPage();
  if (browserName !== 'chrome') {
    describe("selecting frame by id", function() {
      return it("should select frame main", function(done) {
        return browser.frame(frames[1].id, function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  }
  refreshPage();
  if (browserName !== 'chrome') {
    describe("selecting frame by name", function() {
      return it("should select frame main", function(done) {
        return browser.frame(frames[2].name, function(err) {
          should.not.exist(err);
          return done(null);
        });
      });
    });
  }
  return describe("quit", function() {
    return it("should destroy browser", function(done) {
      return browser.quit(function(err) {
        should.not.exist(err);
        return done(null);
      });
    });
  });
};

exports.test = test;

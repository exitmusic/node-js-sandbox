var assert = require("assert")
  , http = require("http")
  , SandboxedModule = require('sandboxed-module')
  , Search = SandboxedModule.require("../app/models/search", {
      requires: {
          'fs': {
            readdir: function(dir, cb) {cb();}
          }
        , 'async': {
            forEach: function(files, iter, cb) {cb();}
          }
        }
    });

describe('Search', function() {
  var testSearch
    , dirSearch
    , request = http.ServerRequest
    , response = http.ServerResponse
    , resultsArray = [];
  
  before(function() {
    testSearch = new Search(
        "/test/directory"
      , ["test", "search", "terms"]
      , function(req, res, params) {
          resultsArray.push({error: params.error, directoryList: params.directoryList});
        }
    );
    
    dirSearch = new Search(
        "/test/directory"
      , ["test", "search", "terms"]
      , function(req, res, params) {
          resultsArray.push({directory: params.directory, contents: params.contents});
        }
    );
    
    // Mock user object in the http request
    request = {
      user: {
        directories: ["test", "directories"]
      }
    };
  });
  
  beforeEach(function() {
    resultsArray = [];
  })
  
  describe('#Constructor', function() {    
    it('should have a directory', function() {
      assert.equal(testSearch.directory, "/test/directory", "The search.directory property does not match");
    });
    
    it('should have search terms', function() {
      assert.equal(testSearch.terms[1], "search", "The search.terms term does not match");
    });
    
    it('should have a view callback function', function() {
      assert.equal(typeof testSearch.view, "function", "The search.view callback function is not a function");
    });
  });
  
  describe('#getMainDirList()', function() {
    it('should call a view with an object containing "error" and "directoryList" as keys', function(done) {
      testSearch.getMainDirList(request, response, function() {
        assert.equal(resultsArray[0].error, true, 'Missing "error" key');
        assert.equal(resultsArray[0].directoryList, 'You are not authorized to search any directories. Please contact us.', 'Missing directoryList key');
        done();
      });
    });
  });
  
  describe('#getDirContents()', function() {
    it('should call a view with an object containing "directory" and "contents" as keys', function(done) {
      dirSearch.getDirContents(request, response, function() {
        assert.equal(resultsArray[0].directory, '/test/directory', 'Missing directory key');
        assert.equal(resultsArray[0].contents, '', 'Missing contents key');
        done();
      })
    })
  })
});
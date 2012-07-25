var assert = require("assert")
  , http = require("http")
  , Search = require("../app/models/search");

describe('Search', function() {
  var testSearch
    , request = http.ServerRequest
    , response = http.ServerResponse
    , resultsArray = [];
  
  before(function() {
    testSearch = new Search(
        "/test/directory"
      , ["test", "search", "terms"]
      , function(req, res, params) {
          var result = {};
          //console.log(params.error+'\n'+params.directoryList);
          result = {error: params.error, directoryList: params.directoryList};
          //console.log(result);
          //console.log(resultsArray.length);
          resultsArray.push(result);
          //console.log(resultsArray);
          //return resultsArray;
        }
    );
    
    // Mock user object in the http request
    request = {
      user: {
        directories: ["test", "directories"]
      }
    };
  });
  
  describe('#Constructor', function() {    
    it('should have a directory', function() {
      assert.equal(testSearch.directory, "/test/directory", "The search.directory property does not match");
    });
    
    it('should have search terms', function() {
      assert.equal(testSearch.terms[1], "search", "The search.terms term does not match");
    });
    
    it('should have a view callback function', function() {
      assert.equal(typeof testSearch.view, "function", "The search.view callback function is not a function")
    });
  });
  
  describe('#getMainDirList()', function() {
    it('should ', function(done) {
      testSearch.getMainDirList(request, response, function() {
        //console.log(testSearch.view(request, response, {error:'none', directoryList:'none'}));
        console.log(resultsArray.length);
        done();
      });
    });
  })
});
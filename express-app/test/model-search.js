var assert = require("assert")
  , Search = require("../app/models/search");

describe('Search', function() {
  var testSearch;
  
  before(function() {
    testSearch = new Search(
        "/test/directory"
      , ["test", "search", "terms"]
      , function() {
          return console.log("Test function");
        }
    );
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
    it('should ', function() {
      
    });
  })
});
var assert = require("assert")
  , Search = require("../app/models/search");

describe('Search', function() {
  describe('#Constructor', function() {
    it('should return an object with 3 properties', function() {
      var newSearch = new Search("/directory", ["search", "terms"], function() {console.log("View");});
      assert.equal("/directory", newSearch.directory, "Error you should fix!");
    });
  });
});
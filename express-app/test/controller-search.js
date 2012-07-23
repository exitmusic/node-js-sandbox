var assert = require("assert")
  , express = require('express');

describe("Search Controller", function() {
  var app;
  
  before(function() {
    app = express.createServer();
    require("./../app/controllers/search-controller")(app);
  });
  
  describe("#routes()", function() {
    it("should have a search route: /searchDirectory", function() {
      assert.equal(app.lookup.get('/searchDirectory').length, 1, "Search directory route is missing");
    });
    it("should have a search route: /search", function() {
      assert.equal(1, app.lookup.get('/search').length, "Search route is missing");
    });
  });
});

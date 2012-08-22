var assert = require("assert")
  , express = require('express')
  , _ = require('underscore');

describe("Search Controller", function() {
  var app;

  function isRoute(verb, path) {
    var routeExists
      , routesByVerb;
    
    routesByVerb = (verb === 'post') ? app.routes.post : app.routes.get;
    routeExists = 
      _.any(routesByVerb, function(properties) {
        return (properties.path === path);
      });
    return routeExists;
  }
  
  before(function() {
    app = express.createServer();
    require("./../app/controllers/search-controller")(app);
  });
  
  describe("#routes()", function() {
    it("should have a search route: /searchDirectory", function() {
      assert.equal(isRoute('get', '/searchDirectory'), true, "Search directory route is missing");
    });
    it("should have a search route: /search", function() {
      assert.equal(isRoute('get', '/search'), true, "Search route is missing");
    });
  });
});

var assert = require('assert')
  , express = require('express')
  , _ = require('underscore');

describe("Authentication Controller", function() {
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
    app = express();
    require("./../app/controllers/authentication-controller")(app);
  });
  
  describe("#routes()", function() {
    it("should have a login GET route: /login", function() {
      assert.equal(isRoute('get', '/login'), true, "Login GET route is missing");
    });
    it("should have a login POST route: /login", function() {
      assert.equal(isRoute('post', '/login'), true, "Login POST route is missing");
    });
    it("should have a logout route: /logout", function() {
      assert.equal(isRoute('get', '/logout'), true, "Logout route is missing");
    });
  });
});
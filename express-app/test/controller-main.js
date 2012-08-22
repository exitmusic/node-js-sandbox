var assert = require("assert")
  , express = require('express')
  , _ = require('underscore');

describe("Main Controller", function() {
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
    require("./../app/controllers/main-controller")(app);
  });
  
  describe("#routes()", function() {
    it("should have a default route: /", function() {
      assert.equal(isRoute('get', '/'), true, "Default route is missing");      
    });
    
    it("should have an about route: /about", function() {
      assert.equal(isRoute('get', '/about'), true, "About route is missing");
    });
    
    it("should have a contact route: /contact", function() {
      assert.equal(isRoute('get', '/contact'), true, "Contact route is missing");
    });
  });
  
  describe("#renderHome()", function() {
    it("should be a function?", function() {
      assert.equal(1,1);
    });
  });
});

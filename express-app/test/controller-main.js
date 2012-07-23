var assert = require("assert")
  , express = require('express');

describe("Main Controller", function() {
  var app;
  
  before(function() {
    app = express.createServer();
    require("./../app/controllers/main-controller")(app);
  });
  
  describe("#routes()", function() {
    it("should have a default route: /", function() {
      assert.equal(app.lookup.get('/').length, 1, "Default route is missing");
    });
    
    it("should have an about route: /about", function() {
      assert.equal(1, app.lookup.get('/about').length, "About route is missing");
    });
    
    it("should have a contact route: /contact", function() {
      assert.equal(1, app.lookup.get('/contact').length, "Contact route is missing");
    });
  });
  
  describe("#renderHome()", function() {
    it("should be a function?", function() {
      assert.equal(1,1);
    });
  });
});

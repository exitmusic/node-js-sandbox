var assert = require("assert")
  , express = require('express');

describe("Authentication Controller", function() {
  var app;
  
  before(function() {
    app = express.createServer();
    require("./../app/controllers/authentication-controller")(app);
  });

  describe("#routes()", function() {
    it("should have a login GET route: /login", function() {
      assert.equal(app.lookup.get('/login').length, 1, "Login GET route is missing");
    });
    it("should have a login POST route: /login", function() {
      assert.equal(1, app.lookup.post('/login').length, "Login POST route is missing");
    });
    it("should have a logout route: /logout", function() {
      assert.equal(1, app.lookup.get('/logout').length, "Logout route is missing");
    });
  });
});
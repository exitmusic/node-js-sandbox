var assert = require("assert")
  , express = require('express')
  , app = express.createServer()
  , controller = require("../app/controllers/main-controller")(app);

describe("Main Controller", function() {
  describe("#routes()", function() {
    it("should have a default route: /", function() {
      assert.equal(1, app.lookup.get('/').length, "Default route is missing");
    })
    it("should have an about route: /about", function() {
      console.log(app.lookup.get('/about')[0]);
      assert.equal(1, app.lookup.get('/about').length, "About route is missing");
    })
    it("should have a contact route: /contact", function() {
      assert.equal(1, app.lookup.get('/contact').length, "Contact route is missing");
    });
  });
  describe("#renderHome()", function() {
    it("should be a function?", function() {
      //console.log(controller.renderHome("", "", ""));
    })
  })
});

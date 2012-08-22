var assert = require('assert')
  , http = require("http")
  , auth = require('../app/models/authentication')
  , Result = require('../app/models/result');

describe('Authentication', function() {
  var authorizedRequest
    , unauthorizedRequest
    , response;
  
  beforeEach(function() {
    // Mock the response object to track the execution of the redirect function
    response = {
        redirected: false
      , redirect: function(url) {
          this.redirected = url;
        }
    };
  });
  
  describe('#ensureAuthenticated()', function() {
    it('should execute the next middleware in the queue if the request is authenticated', function() {
      var isAuthorized = false;
      
      // Mock the user.isAuthenticated function in the http request to return true
      authorizedRequest = {
        isAuthenticated: function() {
          return true;
        }
      };
      
      isAuthorized = auth.ensureAuthenticated(authorizedRequest, response, function() {
        return true;
      });
      assert.equal(isAuthorized, true, "The next middleware was not executed properly");
    });
    
    it('should redirect to the login page if the request is not authenticated', function() {
      var notAuthorized = false;
      
      // Mock the user.isAuthenticated function in the http request to return false
      unauthorizedRequest = {
        isAuthenticated: function() {
          return false;
        }
      };
      
      notAuthorized = auth.ensureAuthenticated(unauthorizedRequest, response, function() {
        return true; // This function should not be executed
      });
      assert.equal(response.redirected, "/login", "The user was not redirected to the homepage");
      assert.equal(notAuthorized, undefined, "The next middleware in queue should not be executed")
    });
  });
  
  describe('#ensurePermission()', function() {
    it('should allow the search only if the user is authorized to search the requested directory', function() {
      // Mock a directory this user is allowed to search: /start
      var result = new Result('/root/search/path/start', 'start', null, null)
        , permissionGranted = false;
      
      // Mock a request to search the directory: /start/of/query/directory
      authorizedRequest = {
          url: 'http://localhost:3000/searchDirectory?directory=/root/search/path/start/of/query/directory'
        , user: {
              searchPath: '/root/search/path'
            , directories: [result]
          }
      };
      
      permissionGranted = auth.ensurePermission(authorizedRequest, response, function() {
        return true;  // This function should be executed as next()
      });
      
      assert.equal(permissionGranted, true, "Permission should be granted to search this directory");
      assert.equal(response.redirected, false, "User should not be redirected to the homepage");
    });
    
    it('should deny the search if the user is not authorized to search the requested directory', function() {
      // Mock a directory this user is allowed to search: /start
      var result = new Result('/root/search/path/start', 'start', null, null)
        , permissionGranted = false;
      
      // Mock a request to search the directory: /notallowed/to/search/this/directory
      unauthorizedRequest = {
          url: 'http://localhost:3000/searchDirectory?directory=/root/search/path/notallowed/to/search/this/directory'
        , user: {
              searchPath: '/root/search/path'
            , directories: [result]
          }
      };
      permissionGranted = auth.ensurePermission(unauthorizedRequest, response, function() {
        return true;  // This function should not be executed
      });
      assert.equal(permissionGranted, undefined, "Permission should not be granted to search this directory");
      assert.equal(response.redirected, '/', "User should be redirected to the homepage");
    });
  })
});

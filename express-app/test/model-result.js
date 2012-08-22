var assert = require('assert')
  , Result = require('../app/models/result');

describe('Result', function() {
  var testResult;
  
  before(function() {
    testResult = new Result(
        '/test/directory'
      , 'filename'
      , 'txt'
      , { phone: '1234567890'
        , email: 'fake@email.com'
        , time: '1_2_34 AM'
      }
    );
  });
  
  describe('#Constructor', function() {
    it('should have a directory indicating where the results are from', function() {
      assert.equal(testResult.directory, "/test/directory", "The result.directory property does not match")
    });
    
    it('should have a filename', function() {
      assert.equal(testResult.filename, "filename", "The result.filename property does not match");
    });
    
    it('should have a file extension', function() {
      assert.equal(testResult.ext, "txt", "The result.ext property does not match");
    });
    
    it('should have a file details object containing: phone, email, and time', function() {
      assert.equal(typeof testResult.fileDetails, "object", "The result.fileDetails property is not an object");
    });
    
    it('should have a file details object with a phone number', function() {
      assert.equal(testResult.fileDetails.phone, "1234567890", "The result phone number does not match");
    });
    
    it('should have a file details object with an email', function() {
      assert.equal(testResult.fileDetails.email, "fake@email.com", "The result email does not match");
    });
    
    it('should have a file details object with a time', function() {
      assert.equal(testResult.fileDetails.time, "1_2_34 AM", "The result time does not match");
    });
  });
});
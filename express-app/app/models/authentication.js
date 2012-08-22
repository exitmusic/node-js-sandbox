var url = require('url')
  , _ = require('underscore');

/**
 * Taken from Jared Hanson's Passport example:
 * https://github.com/jaredhanson/passport-local
 * Simple route middleware to ensure user is authenticated.
 * Use this route middleware on any resource that needs to be protected.  If
 * the request is authenticated (typically via a persistent login session),
 * the request will proceed.  Otherwise, the user will be redirected to the
 * login page.
 */ 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/**
 * Checks if the authenticated user is allowed to search the directory passed in the query string
 * 
 * Step by step of how the query is parsed in this function:
 * 
 * 1. The search path contains the root path of the audio files
 *    req.user.searchPath = /root/search/path
 * 
 * 2. Get the query portion of the URL
 *    queryUrl = directory=/root/search/path/start/of/query/directory
 * 
 * 3. Get the value of the directory param, which is the directory to search
 *    searchDirectory = /root/search/path/start/of/query/directory
 * 
 * 4. Remove the root path portion of the search directory
 *    mainDir = /start/of/query/directory
 * 
 * 5. Get the root folder of the search directory
 *    mainDir = start 
 *   
 * 6. Check if the search mainDir is in the list of main directories this user is allowed to search
 */
function ensurePermission(req, res, next) {
  var queryUrl = url.parse(req.url, true).query
    , searchDirectory = queryUrl.directory.trim()
    , mainDir = searchDirectory.split(req.user.searchPath)[1]
    , validDir = [];
    
  if (mainDir.indexOf('/') !== -1) {
    mainDir = mainDir.split('/')[1];  // Get only the root folder of the search
  }
  
  /**
   * Loop through all of the valid directories this user is allowed to search 
   * and push only the folder names into a valid directories array
   */
  _.each(req.user.directories, function(result) {
    validDir.push(result.filename);
  });
  
  // If the user is allowed to search the mainDir, proceed. If not, redirect to the homepage.
  if (_.indexOf(validDir, mainDir) !== -1) {
    return next();
  } 
  res.redirect('/');
}

exports.ensureAuthenticated = ensureAuthenticated;
exports.ensurePermission = ensurePermission;

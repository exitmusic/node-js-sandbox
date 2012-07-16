var exec = require('child_process').exec
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , async = require('async')
  , auth = require('./authentication')
  , campaign = require('./campaign')
  , Result = require('./result');

function Search(searchTerms) {
  this.searchTerms = searchTerms; //TODO(kchang): For now assume array positions
  this.campaign = ""; //TODO(kchang): Call smart function to determine campaign from search terms?
  this.date = ""; //TODO(kchang): Call smart function to determine date from search terms?
  this.telephone = ""; //TODO(kchang): Call smart function to determine telephone from search terms?
  this.agent = ""; //TODO(kchang): Call smart function to determine agent from search terms?
}
/**
 * Gets results from the file system 
 * @method getResults
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerREsponse} res Instance of Node's HTTP server response class
 * @param {Function} viewCallback Callback function to render the view
 */
Search.prototype.getResults = function(req, res, viewCallback) {
  var LOCAL_SEARCH_PATH = "~"
    , SEARCH_PATH = "/home"
    , REGEX_IGNORE_HIDDEN = "\\( ! -regex '.*/\\..*' \\)" // Discards hidden files and directories
    , PRINT_FORMAT = "'%p||%f||wav\n'"
    , dirQueries = []
    , validPaths = [] // Paths allowed to search
    , searchTerms = this.searchTerms
    , results = []
    , queries = [];
  
  // TODO(kchang): Search available directories for campaigns  
  // TODO(kchang): Search agent, telephone, date
  
  dirQueries = getConstructedDirQueries(req.user.directories, LOCAL_SEARCH_PATH);
  validPaths = getValidPaths(dirQueries);
  queries = getConstructedFileQueries(validPaths, searchTerms, REGEX_IGNORE_HIDDEN, PRINT_FORMAT);
  
  //TODO(kchang): Move declarations up when done testing
  var filesArray
    , elementParsed
    , oneResult;
  async.forEach(queries, function(query, callback) {
    exec(query, function(err, stdout, stderr) {
      filesArray = stdout.split("\n");
      filesArray.forEach(function(element, index) {
        if (element !== "") {
          elementParsed = element.split("||"),
          oneResult = new Result(elementParsed[0], elementParsed[1], elementParsed[2]);
          results.push(oneResult);
        }
      });
      callback(null, results);
    });
  }, function(err) {
    viewCallback(req, res, results, searchTerms); // calls the view
  });
  // TODO(kchang): Create a static file containing a directory listing the first time? Use grep to search?
};

//TODO(kchang): Better solution for constants
Search.prototype.getList = function(req, res, viewCallback) {
  var LOCAL_SEARCH_PATH = "~"
    , REGEX_IGNORE_HIDDEN = "\\( ! -regex '.*/\\..*' \\)" // Discards hidden files and directories
    , PRINT_FORMAT = "'%p||%f||wav\n'"
    , dirQueries = []
    , validPaths = [] // Paths allowed to search
    , directories = []; 

  if (req.isAuthenticated()) {
    dirQueries = getConstructedDirQueries(req.user.directories, LOCAL_SEARCH_PATH, REGEX_IGNORE_HIDDEN);
    validPaths = getValidPaths(req, res, dirQueries, viewCallback);
  } else {
    directories.push("Log in to see available directories");
    viewCallback(req, res, true, directories);
  }
  //TODO(kchang): Don't call this again if the results already exist
  //fs.readdir(LOCAL_SEARCH_PATH, function(err, files) {
    //console.log(err+files);
    //viewCallback(req, res, files);
  //});
}

//TODO(kchang): May need to use wildcards based on directory name structure
function getValidPaths(req, res, dirQueries, viewCallback) {
  var dirArray = []
    , results = [];
  
  async.forEach(dirQueries, function(query, callback) {
    exec(query, function(err, stdout, stderr) {
      dirArray = stdout.split("\n");
      dirArray = _.without(dirArray, "")
      dirArray.forEach(function(element, index) {
        results.push(path.normalize(element));
      });
      callback(null, results);
    });
  }, function(err) {
    if (results.length === 0) {
      err = true;
      results.push("You are not authorized to search any directories. Please contact us.");
    }
    viewCallback(req, res, err, results); // calls the view
  });
  return results;
}

function getConstructedDirQueries(directories, LOCAL_SEARCH_PATH, REGEX_IGNORE_HIDDEN) {
  var query
    , dirQueries = [];
  
  directories.forEach(function(directory, index) {
    query = "find "
      + LOCAL_SEARCH_PATH
      + " "
      + REGEX_IGNORE_HIDDEN
      + " -maxdepth 1 -type d -iname '*"
      + directory
      + "*'";
    dirQueries.push(query);
  });
  return dirQueries;
}

function getConstructedFileQueries(validPaths, searchTerms, REGEX_IGNORE_HIDDEN, PRINT_FORMAT) {
  var findQuery
    , constructedQueries = [];
  
  //TODO(kchang): Nested loop, potential to be very slow
  validPaths.forEach(function(onePath, index) {
    searchTerms.forEach(function(searchTerm, index) {
      findQuery = "find "
        + onePath //TODO(kchang): Loop through all paths and create separate queries?
        + " "
        + REGEX_IGNORE_HIDDEN
        + " -type f -iname '*"
        + searchTerm //TODO(kchang): Better solution
        + "*' -printf "
        + PRINT_FORMAT;
      constructedQueries.push(findQuery);
    });
  });
  return constructedQueries;
}

function getCampaigns() {
  var CAMPAIGN_PATH = "~"
    , query;
  
  query = "find "
    + CAMPAIGN_PATH
    + " -maxdepth 1 -type d -print0";
  exec(query, function(err, stdout, stderr) {
    fs.writeFile('/tmp/query-campaigns.log', stdout, function(err) {});
  });
}

//exports.getResults = getResults;
//exports.getList = getList;
module.exports = Search;

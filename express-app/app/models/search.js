var exec = require('child_process').exec
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , async = require('async')
  , auth = require('./authentication')
  , campaign = require('./campaign')
  , Result = require('./result')

  , LOCAL_SEARCH_PATH = "~"
  , SEARCH_PATH = "/home"
  , REGEX_IGNORE_HIDDEN = "\\( ! -regex '.*/\\..*' \\)" // Discards hidden files and directories
  , PRINT_FORMAT = "'%p||%f||wav\n'";

function Search(searchTerms) {
  this.searchTerms = searchTerms; //TODO(kchang): For now assume array positions
  this.campaign = ""; //TODO(kchang): Call smart function to determine campaign from search terms?
  this.date = ""; //TODO(kchang): Call smart function to determine date from search terms?
  this.telephone = ""; //TODO(kchang): Call smart function to determine telephone from search terms?
  this.agent = ""; //TODO(kchang): Call smart function to determine agent from search terms?
}

/**
 * Gets a list of the root directories the user is allowed to search
 * @method getMainDirList
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Function} viewCallback Callback function to render the view
 */
Search.prototype.getMainDirList = function(req, res, viewCallback) {
  var dirQueries = []
    , validPaths = [] // Paths allowed to search
    , directories = []; 

  if (req.isAuthenticated()) {
    dirQueries = getConstructedDirQueries(req.user.directories);
    validPaths = getValidPaths(req, res, dirQueries, viewCallback);
  } else {
    directories.push("Log in to see available directories");
    viewCallback(req, res, {
        error: true
      , directoryList: directories
    });
  }
}

/**
 * Gets a list of folders in a given directory
 * @method getFolderList
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {String} directory The directory to read the contents of
 * @param {Function} viewCallback Callback function to render the view
 */
Search.prototype.getFolderList = function(req, res, directory, viewCallback) {
  var folders = [];

  fs.readdir(directory, function(err, files) {
    try {
      files.forEach(function(element, index) {
        console.log(directory+"/"+element+": "+fs.statSync(directory+"/"+element).isDirectory())
        if (fs.statSync(directory+"/"+element).isDirectory()) {
          folders.push(new Result(element, null, null));
        }
      });
    } catch (error) {
      //error
    }
    viewCallback(req, res, {
        folders: folders
      , directory: directory
    });
  });
}

/**
 * Gets results from the file system 
 * @method getResults
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Function} viewCallback Callback function to render the view
 */
Search.prototype.getResults = function(req, res, viewCallback) {
  var dirQueries = []
    , validPaths = [] // Paths allowed to search
    , searchTerms = this.searchTerms
    , results = []
    , queries = []
    , filesArray
    , elementParsed;
  
  dirQueries = getConstructedDirQueries(req.user.directories);
  validPaths = getValidPaths(dirQueries);
  queries = getConstructedFileQueries(validPaths, searchTerms);
  
  async.forEach(queries, function(query, callback) {
    exec(query, function(err, stdout, stderr) {
      filesArray = stdout.split("\n");
      filesArray.forEach(function(element, index) {
        if (element !== "") {
          elementParsed = element.split("||"),
          // [0]: directory, [1]: filename, [2]: extension
          results.push(new Result(elementParsed[0], elementParsed[1], elementParsed[2]));
        }
      });
      callback(null, results);
    });
  }, function(err) {
    viewCallback(req, res, {
        results: results
      , searchTerms: searchTerms // calls the view
    });
  });
  // TODO(kchang): Create a static file containing a directory listing the first time? Use grep to search?
};

/**
 * Gets a list of directories containing the keywords in the dirQueries array
 * @method getValidPaths
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Array} dirQueries A list of keywords used to search directory names
 * @param {Function} viewCallback Callback function to render the view
 */
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
    results = _.uniq(results);
    if (results.length === 0) {
      err = true;
      results.push("You are not authorized to search any directories. Please contact us.");
    }
    viewCallback(req, res, {
        error: err
      , directoryList: results // calls the view
    });
  });
  return results;
}

function getConstructedDirQueries(directories) {
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

function getConstructedFileQueries(validPaths, searchTerms) {
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

module.exports = Search;

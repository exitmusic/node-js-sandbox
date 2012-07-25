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

/**
 * Gets a list of the root directories the user is allowed to search
 * @constructor
 * @param {String} directory The directory to perform the search on
 * @param {Array} terms The terms used to perform the search
 * @param {Function} view The view to call to display the results
 */
function Search(directory, terms, view) {
  this.directory = directory;
  this.terms = terms;
  this.view = view;
}

/**
 * Asynchronously gets a list of the root directories the user is allowed to search
 * @method getMainDirList
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Function} cb Callback function
 */
Search.prototype.getMainDirList = function(req, res, cb) {
  var dirQueries = []
    , directories = []
    , results = []
    , viewCallback = this.view; 

  dirQueries = getConstructedDirQueries(req.user.directories);
  async.forEach(dirQueries, function(query, callback) {
    exec(query, function(err, stdout, stderr) {
      directories = _.without(stdout.split("\n"), "")
      directories.forEach(function(element, index) {
        results.push(path.normalize(element));
      });
      callback(null, 'done');
    });
  }, function(err) {
    results = _.uniq(results);
    if (results.length === 0) {
      err = true;
      results.push("You are not authorized to search any directories. Please contact us.");
    }
    viewCallback(req, res, {
        error: err
      , directoryList: results
    });
    cb();
  });  
}

/**
 * Asynchronously gets the contents of a given directory
 * @method getDirContents
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Function} cb Callback function
 */
Search.prototype.getDirContents = function(req, res, cb) {
  var directory = this.directory
    , viewCallback = this.view
    , contents = [];

  fs.readdir(directory, function(err, files) {
    async.forEach(files, function(file, callback) {
      fs.stat(directory+"/"+file, function(err, stats) {
        if (stats.isDirectory()) {
          contents.push(new Result(directory+"/"+file, null, null));
        } else {
          contents.push(new Result(directory, file, file.split(".").pop()));
        }
        callback(null, 'done');
      });
    }, function(err) {
      viewCallback(req, res, {
          directory: directory  
        , contents: contents
      });
      cb();
    });
  });
}

/**
 * Asynchronously gets results from the file system 
 * @method getResults
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Function} cb Callback function
 */
Search.prototype.getResults = function(req, res, cb) {
  var dirQueries = []
    , validPaths = [] // Paths allowed to search
    , searchTerms = this.searchTerms
    , viewCallback = this.view
    , results = []
    , queries = []
    , filesArray
    , elementParsed;
  
  dirQueries = getConstructedDirQueries(req.user.directories);
  //TODO(kchang): This is no longer valid
  //validPaths = getValidPaths(dirQueries);
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
      callback(null, 'done');
    });
  }, function(err) {
    viewCallback(req, res, {
        results: results
      , searchTerms: searchTerms // calls the view
    });
  });
};

/**
 * Constructs a find query to search for directories containing the keywords in the directories array
 * @method getConstructedDirQueries
 * @param {Array} directories Instance of Node's HTTP server request class
 * @return {Array} An array containing all of the queries
 */
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
        + onePath
        + " "
        + REGEX_IGNORE_HIDDEN
        + " -type f -iname '*"
        + searchTerm
        + "*' -printf "
        + PRINT_FORMAT;
      constructedQueries.push(findQuery);
    });
  });
  return constructedQueries;
}

module.exports = Search;

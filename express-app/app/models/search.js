var exec = require('child_process').exec
  , fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , async = require('async')
  , auth = require('./authentication')
  , Result = require('./result')

  , REGEX_IGNORE_HIDDEN = "\\( ! -regex '.*/\\..*' \\)" // Discards hidden files and directories
  , PRINT_FORMAT = "'%p||%f||wav\n'";

/**
 * Holds the parameters needed to perform a search of the file system
 * @constructor
 * @param {String} The default/root directory to begin all searches
 * @param {String} directory The directory to perform the search on
 * @param {Array} terms The terms used to perform the search
 * @param {Function} view The view to call to display the results
 */
function Search(searchPath, directory, terms, view) {
  this.searchPath = searchPath;
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
  
  // Get an array of find queries used to find the allowed main directories to search
  dirQueries = getConstructedDirQueries(this.searchPath, req.user.dirKeywords);
  
  /**
   * Run the queries to find actual directory paths this user can search.
   * Return the directories as an array of Results
   */ 
  async.forEach(dirQueries, function(query, callback) {
    exec(query, function(err, stdout, stderr) {
      directories = _.without(stdout.split("\n"), "")
      directories.forEach(function(directory, index) {
        results.push(
            new Result(path.normalize(directory)
              , path.normalize(directory).split("/").pop()
              , null)
        );
      });
      callback(null, 'done');
    });
  }, function(err) {
    // Remove duplicates of any directory folder names
    results = _.uniq(results, false, function(result) {
      return result.filename
    });
    
    // Set valid directories this user can search 
    req.user.directories = results; 
    if (results.length === 0) {
      err = true;
      results.push("You are not authorized to search any directories. Please contact us.");
    }
    
    // Display results in the specified view
    viewCallback(req, res, {
        error: err
      , directoryList: results
    });
    if (typeof cb === "function") {
      cb();
    }
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
    , contents = []
    , fileDetails = {};

  // Read contents of the directory
  fs.readdir(directory, function(err, files) {
    /**
     * Loop through each file and determine if it is a file or directory. If it's
     * a directory, store the full path, immediate folder name, and no extension
     * 
     * If it's a file, store the full path, file name, file extension, and file details.
     */
    async.forEach(files, function(file, callback) {
      fs.stat(directory+"/"+file, function(err, stats) {
        if (stats.isDirectory()) {
          // Push directory result: full path, immediate directory name, no extension
          contents.push(new Result(directory+"/"+file, file, null));
        } else {
          // There could be non-standard file names
          try {
            fileDetails = getFileDetails(file);
          } catch (err) {
            // Do nothing about it
          }
          // Push file result: full path, filename, extension, fileDetails
          contents.push(new Result(directory, file, file.split(".").pop(), fileDetails));
        }
        callback(null, 'done');
      });
    }, function(err) {
      // Display results in the specified view
      viewCallback(req, res, {
          directory: directory.split("/").pop() // Only the folder name of the directory's contents
        , contents: contents
      });
      if (typeof cb === "function") {
        cb();
      }
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
  
  dirQueries = getConstructedDirQueries(this.searchPath, req.user.directories);
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
function getConstructedDirQueries(searchPath, directories) {
  var query
    , dirQueries = [];
  
  directories.forEach(function(directory, index) {
    query = "find "
      + searchPath
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

function getFileDetails(file) {
  // Sample filename: 1234567890 by person@email.com @ 2_58_01 PM.wav
  var fileDetails = {}
    , phoneSplitEmailTime = file.split(" by ")
    , phone = phoneSplitEmailTime[0]
    , emailSplitTime = phoneSplitEmailTime[1].split(" @ ")
    , email = emailSplitTime[0]
    , timeSplitExt = emailSplitTime[1].split(".")
    , time = timeSplitExt[0];
  
  fileDetails = {
      phone: phone
    , email: email
    , time: time
  }
  return fileDetails;
}

module.exports = Search;

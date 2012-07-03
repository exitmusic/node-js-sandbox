var exec = require('child_process').exec
  , fs = require('fs')
  , async = require('async')
  , auth = require('./authentication')
  , campaign = require('./campaign')
  , Result = require('./result');

function Search(searchTerms) {
  this.searchTerms = searchTerms; //TODO: For now assume array positions
  this.campaign = ""; //TODO: Call smart function to determine campaign from search terms?
  this.date = ""; //TODO: Call smart function to determine date from search terms?
  this.telephone = ""; //TODO: Call smart function to determine telephone from search terms?
  this.agent = ""; //TODO: Call smart function to determine agent from search terms?
}
/**
 * Gets results from the file system
 * @method getResults
 * @param {Array} searchTerms Array containing search terms // TODO: Remove this
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerREsponse} res Instance of Node's HTTP server response class
 * @param {Function} cb Callback function to render the view
 */
//function getResults(searchTerms, req, res, cb) {
Search.prototype.getResults = function(req, res, viewCallback) {
  var LOCAL_SEARCH_PATH = "~"
    , SEARCH_PATH = "/home"
    , REGEX_IGNORE_HIDDEN = "\\( ! -regex '.*/\\..*' \\)" // Discards hidden files and directories
    , PRINT_FORMAT = "'%p||%f||wav\n'"
    , path
    , validPaths = []
    , searchTerms = this.searchTerms
    , results = []
    , findQuery
    , queries = [];
  
  req.user.directories.forEach(function(directory, index) {
    path = LOCAL_SEARCH_PATH
      + "/"
      + directory;
    validPaths.push(path);
  });
  
  // Search available directories for campaigns
  //TODO: Code here
  
  // Search agent, telephone, date
  searchTerms.forEach(function(searchTerm, index) {
    findQuery = "find "
      + validPaths[0] //TODO: Loop through all paths and create separate queries?
      + " "
      + REGEX_IGNORE_HIDDEN
      + " -type f -iname '*"
      + searchTerm //TODO: Better solution
      + "*' -printf "
      + PRINT_FORMAT;
    queries.push(findQuery);
  });
  
  //TODO: Delete this
  /*async.parallel([
    function(callback) {
      queries.forEach(function(query) {
        exec(query, function(err, stdout, stderr) {
          var filesArray
            , elementParsed
            , oneResult;
          
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
        
      });
    }
  ],
  function(err, resultsx) {
    console.log(results);
    console.log(resultsx);
    cb(resultsx, searchTerms, req, res);
  });*/
  
  //TODO: Move declarations up when done testing
  var filesArray
    , elementParsed
    , oneResult;
  async.forEachSeries(queries, function(query, callback) {
    exec(query, function(err, stdout, stderr) {

      
      filesArray = stdout.split("\n");
      filesArray.forEach(function(element, index) {
        console.log(2);
        if (element !== "") {
          elementParsed = element.split("||"),
          oneResult = new Result(elementParsed[0], elementParsed[1], elementParsed[2]);
          results.push(oneResult);
        }
      });
      callback(null, results);
    });
  }, function(err) {
    viewCallback(results, searchTerms, req, res); // calls the view
  });
  // TODO: Create a static file containing a directory listing the first time? Use grep to search?
};

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

function getList(searchPath, regEx) {
  // TODO: Create a static file containing a complete file listing the first time. Use grep to search.
  var queryAll = "find " + searchPath + " " + regEx + " -type f -printf '%p||%f||wav\n'";
  
  exec(queryAll, function(err, stdout, stderr) {
    fs.writeFile('/tmp/query-find.log', stdout, function(err) {});
  });
}

//exports.getResults = getResults;
//exports.getList = getList;
module.exports = Search;

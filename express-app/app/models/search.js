var exec = require('child_process').exec
  , fs = require('fs')
  , Result = require('./result');

/**
 * Gets results from the file system
 * @method getResults
 * @param {Array} searchTerms Array containing search terms
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerREsponse} res Instance of Node's HTTP server response class
 */
function getResults(searchTerms, req, res) {
  var LOCAL_SEARCH_PATH = "~"
    , SEARCH_PATH = "/home"
    , REGEX_IGNORE_HIDDEN = "\\( ! -regex '.*/\\..*' \\)" // Discards hidden files and directories
    , PRINT_FORMAT = "'%p||%f||wav\n'"
    , results = []
    , query;
  
  // TODO: Testing solution, not final
  searchTerms.forEach(function(element, index) {
    query = "find " 
      + LOCAL_SEARCH_PATH 
      + " " 
      + REGEX_IGNORE_HIDDEN 
      + " -type f -iname '*" 
      + searchTerms 
      + "*' -printf " 
      + PRINT_FORMAT;
  });

	// TODO: Create a static file containing a directory listing the first time. Use grep to search.
  //getList(SEARCH_PATH, REGEX_IGNORE_HIDDEN);
  //list = fs.readFileSync('/tmp/query-find.log');
  
	// TODO: This can probably be replaced by existing functions in the File System module
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
	  res.render('search-results', {
	    results: results, 
	    title: 'Search', 
	    isAuthenticated: req.isAuthenticated(),
	    user: req.user,
	    searchTerms: searchTerms
	  });
	});
};

// TODO: Needed?
function runQuery(query, cb) {
  exec(query, cb(err, stdout, stderr));
}

function getCampaigns() {
  
}

function getList(searchPath, regEx) {
  // TODO: Create a static file containing a directory listing the first time. Use grep to search.
  var queryAll = "find " + searchPath + " " + regEx + " -type f -printf '%p||%f||wav\n'";
  exec (queryAll, function(err, stdout, stderr) {
    fs.writeFile('/tmp/query-find.log', stdout, function(err) {});
  });
};

exports.getResults = getResults;
exports.getList = getList;

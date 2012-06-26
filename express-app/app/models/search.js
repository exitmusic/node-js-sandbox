var exec = require('child_process').exec;
var fs = require('fs');
var Result = require('./result');

function getResults(searchTerms, req, res) {
	var SEARCH_PATH = "~";
	var REG_EX_IGNORE_HIDDEN = "\\( ! -regex '.*/\\..*' \\)"; // Discards hidden files and directories (double escape backslashes)
	var PRINT_FORMAT = "'%p||%f||wav\n'";
	
	var query = "find " + SEARCH_PATH + " " + REG_EX_IGNORE_HIDDEN + " -type f -iname '*" + searchTerms + "*' -printf " + PRINT_FORMAT;
	var filesArray;
	var results = [];

	// TODO: Create a static file containing a directory listing the first time. Use grep to search.
	//var queryOut = "find " + searchPath + " -printf '%p||%f||wav\n' > /tmp/query-find.log";
	//exec (queryOut, function(err, stdout, stderr) {});
	
	// TODO: This can probably be replaced by existing functions in the File System module
	exec(query, function(err, stdout, stderr) {
		filesArray = stdout.split("\n");
		filesArray.forEach(function(element, index) {
			if (element !== "") {
				elementParsed = element.split("||");
				var oneResult = new Result(elementParsed[0], elementParsed[1], elementParsed[2]);
				results.push(oneResult);
			}
		});
		res.render('search-results', {
			results: results, 
			title: 'Search', 
			isAuthenticated: req.isAuthenticated(),
			user: req.user}
		);
	});
};

function getList(path, req, res) {
	fs.readdir(path, function(err, files) {
		res.render('search', {results: files, title: 'Search'});
	})
};

exports.getResults = getResults;
exports.getList = getList;
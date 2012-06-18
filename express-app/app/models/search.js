var exec = require('child_process').exec;
var fs = require('fs');
var Result = require('./result');

function getResults(searchTerms, req, res) {
	var filesArray;
	var searchPath = "~";
	var query = "find " + searchPath + " -name *" + searchTerms + "*.wav -printf '%p %f wav\n'";
	var results = [];
	
	
	// TODO: This can probably be replaced by existing functions in the File System module
	exec(query, function(err, stdout, stderr) {
		filesArray = stdout.split("\n");
		filesArray.forEach(function(element, index) {
			if (element !== "") {
				elementParsed = element.split(" ");
				var oneResult = new Result(elementParsed[0], elementParsed[1], elementParsed[2]);
				results.push(oneResult);
				//oneResult.someFunction(); // TODO: Remove
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
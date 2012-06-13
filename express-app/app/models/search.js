var exec = require('child_process').exec;
var result = require('./result');

function getResults(searchTerms, req, res) {
	var filesArray;
	var searchPath;
	var query = "ls -h ~ | grep -i " + searchTerms;
	var results = [];
	
	
	// TODO: This can probably be replaced by existing functions in the File System module
	exec(query, function(err, stdout, stderr) {
		filesArray = stdout.split("\n");
		filesArray.forEach(function(element, index) {
			if (element !== "") {
				var oneResult = new result(element+"-path", element+"-filename", element+"-filetype");
				results.push(oneResult);
				//oneResult.someFunction(); // TODO: Remove
			}
		});
		res.render('search', {results: results, title: 'Search'});
	});
};

function getList(path) {
	
};

exports.getResults = getResults;
exports.getList = getList;
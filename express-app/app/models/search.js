var exec = require('child_process').exec;
var result = require('./result');

exports.getResults = function (searchTerms, req, res) {
	var content = "<ul>";
	var filesArray;
	var query = "ls -h ~ | grep -i " + searchTerms;
	var results = [];
	
	
	// TODO: Pass JSON object to view, not HTML content
	exec(query, function(err, stdout, stderr) {
		filesArray = stdout.split("\n");
		filesArray.forEach(function(element, index) {
			if (element !== "") {
				var oneResult = new result(element+"-path", element+"-filename", element+"-filetype");
				results.push(oneResult);
				//content += '<li><a href="'+index+'">' + element + '</a></li>';
			}
		});
		//content += "</ul>"
		res.render('search', {results: results, title: 'Search'});
	});
}

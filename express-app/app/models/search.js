var exec = require('child_process').exec;

exports.getResults = function (searchTerms, req, res) {
	var content = "";
	var filesArray;
	
	exec("ls -h ~ | grep -i " + searchTerms, function(err, stdout, stderr) {
		filesArray = stdout.split("\n");
		filesArray.forEach(function(element, index) {
			content += '<a href="'+index+'">' + element + '</a>';
		});
		res.render('search', {query: content, title: 'Search', page: 'search'});
	});
}
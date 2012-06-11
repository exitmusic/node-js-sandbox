var exec = require('child_process').exec;

exports.getResults = function (searchTerms, req, res) {
	var content = "";
	
	exec("ls -h ~ | grep -i " + searchTerms, function(err, stdout, stderr) {
		content += stdout.split("\n");
		res.render('search', {query: content, title: 'Search', page: 'search'});
	});
}
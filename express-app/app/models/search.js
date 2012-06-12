var exec = require('child_process').exec;

exports.getResults = function (searchTerms, req, res) {
	var content = "<ul>";
	var filesArray;
	
	exec("ls -h ~ | grep -i " + searchTerms, function(err, stdout, stderr) {
		filesArray = stdout.split("\n");
		filesArray.forEach(function(element, index) {
			if (element !== "") {
				content += '<li><a href="'+index+'">' + element + '</a></li>';
			}
		});
		content += "</ul>"
		res.render('search', {query: content, title: 'Search'});
	});
}

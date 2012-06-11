var fs = require('fs');
var url = require('url');
var query = require('querystring');
var exec = require('child_process').exec;

exports.process = function(req, res) {
	// search code here?
	var query = url.parse(req.url, true).query;
	var content = "";
	
	exec("pwd; ls -l ~ | grep -i " + query.terms, function(err, stdout, stderr) {
		content += stdout;
		res.render('search', {query: content});
	});
};
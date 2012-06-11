var fs = require('fs');
var url = require('url');
var query = require('querystring');
var exec = require('child_process').exec;
var search = require('./../models/search');

module.exports = function(app) {
	app.get('/search', function(req, res) {
		// search code here?
		var query = url.parse(req.url, true).query;
		var content = "";
		
		search.getResults(query.terms, req, res);
		/*exec("pwd; ls -l ~ | grep -i " + query.terms, function(err, stdout, stderr) {
			content += stdout;
			res.render('search', {query: content, title: 'Search', page: 'search'});
		});*/
	});
}
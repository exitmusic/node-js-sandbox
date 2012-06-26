var fs = require('fs');
var url = require('url');
var query = require('querystring');
var exec = require('child_process').exec;
var search = require('./../models/search');
var auth = require('./../models/authentication');

function routes(app) {
	app.get('/search', auth.ensureAuthenticated, function(req, res) {
		// search code here?
		var query = url.parse(req.url, true).query;
		var content = "";
		
		search.getResults(query.terms, req, res);
		//search.getList('/com/home/users/kchang', req, res);
	});
}

module.exports = routes;

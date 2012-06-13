var fs = require('fs');
var url = require('url');
var query = require('querystring');
var exec = require('child_process').exec;
var search = require('./../models/search');

function addRoutes(app) {
	app.get('/search', function(req, res) {
		// search code here?
		var query = url.parse(req.url, true).query;
		var content = "";
		
		//search.getResults(query.terms, req, res);
		search.getList('/com/home/users/kchang', req, res);
	});
}

module.exports = addRoutes;

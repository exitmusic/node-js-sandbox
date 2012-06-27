var fs = require('fs')
  , url = require('url')
  , query = require('querystring')
  , exec = require('child_process').exec
  , search = require('./../models/search')
  , auth = require('./../models/authentication');

function routes(app) {
	app.get('/search', auth.ensureAuthenticated, function(req, res) {
		var queryObj = url.parse(req.url, true).query
		  , termsArray = queryObj.terms.split(" ");

		search.getResults(termsArray, req, res);
	});
}

module.exports = routes;

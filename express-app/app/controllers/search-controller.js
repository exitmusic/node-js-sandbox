var fs = require('fs')
  , url = require('url')
  //, query = require('querystring')
  //, exec = require('child_process').exec
  , auth = require('./../models/authentication')
  , exec = require('child_process').exec
  , Search = require('./../models/search')
  , Result = require('./../models/result');

function routes(app) {
  app.get('/search', auth.ensureAuthenticated, function(req, res) {
    var queryUrl
      , searchTerms = []
      , audioSearch;
		
		queryUrl = url.parse(req.url, true).query;
		searchTerms = queryUrl.terms.split(" ");
		audioSearch = new Search(searchTerms);
		audioSearch.getResults(req, res, renderSearchResults);
	});
}

/**
 * Renders the search results page
 * @method renderSearchResults
 * @param {Array} results Array containing results
 * @param {Array} searchTerms Array containing search terms
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerREsponse} res Instance of Node's HTTP server response class
 */
function renderSearchResults(results, searchTerms, req, res) {
  res.render('search-results', {
    results: results, 
    title: 'Search', 
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    searchTerms: searchTerms
  });
}


module.exports = routes;

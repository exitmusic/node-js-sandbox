var url = require('url')
  , _ = require('underscore')
  , auth = require('./../models/authentication')
  , exec = require('child_process').exec
  , Search = require('./../models/search')
  , Result = require('./../models/result');

function routes(app) {
  app.get('/searchDirectory', auth.ensureAuthenticated, function(req, res) {
    var queryUrl
      , searchDirectory
      , searchTerms = []
      , audioSearch;
    
    queryUrl = url.parse(req.url, true).query;
    searchDirectory = queryUrl.directory.trim();
    audioSearch = new Search(searchTerms);
    audioSearch.getFolderList(req, res, searchDirectory, renderFolderList);
  });
  app.get('/search', auth.ensureAuthenticated, function(req, res) {
    var queryUrl
      , searchTerms = []
      , audioSearch;
		
    queryUrl = url.parse(req.url, true).query;
    searchTerms = queryUrl.terms.trim().split(" ");
    searchTerms = _.without(searchTerms, "");
    audioSearch = new Search(searchTerms);
    audioSearch.getResults(req, res, renderSearchResults);
	});
}

/**
 * Renders the search results page
 * @method renderFolderList
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerREsponse} res Instance of Node's HTTP server response class
 * @param {Object} results params Object containing extra parameters
 */
function renderFolderList(req, res, params) {
  res.render('folder-list', {
      title: 'Folders'
    , isAuthenticated: req.isAuthenticated()
    , user: req.user
    , folders: params.folders 
    , directory: params.directory
  });
}

/**
 * Renders the search results page
 * @method renderSearchResults
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerREsponse} res Instance of Node's HTTP server response class
 * @param {Object} results params Object containing extra parameters
 */
function renderSearchResults(req, res, params) {
  res.render('search-results', {
      title: 'Search'
    , isAuthenticated: req.isAuthenticated()
    , user: req.user
    , results: params.results 
    , searchTerms: params.searchTerms
  });
}

module.exports = routes;

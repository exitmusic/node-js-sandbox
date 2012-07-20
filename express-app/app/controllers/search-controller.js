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
      , audioSearch;
    
    queryUrl = url.parse(req.url, true).query;
    searchDirectory = queryUrl.directory.trim();
    audioSearch = new Search(searchDirectory, [], renderDirectoryContents);
    audioSearch.getDirContents(req, res);
  });
  app.get('/search', auth.ensureAuthenticated, function(req, res) {
    var queryUrl
      , searchTerms = []
      , audioSearch;
		
    queryUrl = url.parse(req.url, true).query;
    searchTerms = queryUrl.terms.trim().split(" ");
    searchTerms = _.without(searchTerms, "");
    audioSearch = new Search("", searchTerms, renderSearchResults);
    audioSearch.getResults(req, res);
  });
}

/**
 * Renders the search results page
 * @method renderFolderList
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {String} params.directory Full path of the directory to display the contents of
 * @param {Array} params.contents The contents of the given directory
 */
function renderDirectoryContents(req, res, params) {
  res.render('directory-contents', {
      title: 'Directory'
    , isAuthenticated: req.isAuthenticated()
    , user: req.user
    , directory: params.directory
    , contents: params.contents
  });
}

/**
 * Renders the search results page
 * @method renderSearchResults
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Array} params.searchTerms The terms used to search with
 * @param {Array} params.results The results of the search performed using searchTerms
 */
function renderSearchResults(req, res, params) {
  res.render('search-results', {
      title: 'Search'
    , isAuthenticated: req.isAuthenticated()
    , user: req.user
    , searchTerms: params.searchTerms
    , results: params.results
  });
}

module.exports = routes;

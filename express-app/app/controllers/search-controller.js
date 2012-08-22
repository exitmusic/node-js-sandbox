var url = require('url')
  , _ = require('underscore')
  , auth = require('./../models/authentication')
  , exec = require('child_process').exec
  , Search = require('./../models/search')
  , Result = require('./../models/result');

function routes(app) {
  /**
   * Route to handle requests to display the contents of directories. Authenticated.
   * @param /searchDirectory URL to access this route
   * @param auth.ensureAuthenticated Checks if a user is logged in
   * @param auth.ensurePermission Checks if the user is allowed to search the requested directory
   */
  app.get('/searchDirectory', auth.ensureAuthenticated, auth.ensurePermission, function(req, res) {
    var queryUrl
      , searchDirectory
      , audioSearch;
    
    //Get the query string portion of the URL from the parsed URL object
    queryUrl = url.parse(req.url, true).query;
    
    // Get the directory value from the query string
    searchDirectory = queryUrl.directory.trim();
    audioSearch = new Search(req.user.searchPath, searchDirectory, [], renderDirectoryContents);
    audioSearch.getDirContents(req, res);
  });
  
  /**
   * Route to handle requests to search a directory using the given search terms. Authenticated
   * Currently not being used in iteration one of Audio Search.
   */
  app.get('/search', auth.ensureAuthenticated, function(req, res) {
    var queryUrl
      , searchTerms = []
      , audioSearch;
		
    queryUrl = url.parse(req.url, true).query;
    searchTerms = queryUrl.terms.trim().split(" ");
    searchTerms = _.without(searchTerms, "");
    audioSearch = new Search(req.user.searchPath, "", searchTerms, renderSearchResults);
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

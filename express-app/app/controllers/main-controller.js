var Search = require('./../models/search');

function routes(app) {
  /**
   * Route to Homepage
   */
  app.get('/', function(req, res) {
    var rootSearch;
    
    // If a user is logged in, show the available directories this user is allowed to search
    if (req.isAuthenticated()) {
      rootSearch = new Search(req.user.searchPath, "", [], renderHome)
      rootSearch.getMainDirList(req, res);
    } else {
      renderHome(req, res, {
          error: true
        , directoryList: ["Log in to see available directories"]
      });
    }
  });
  
  /**
   * Route to About page (not currently used)
   */
  app.get('/about', function(req, res) {
    res.render('about', {
        title: 'About'
      , isAuthenticated: req.isAuthenticated()
      , user: req.user}
    );
  });
  
  /**
   * Route to Contact page (not currently used)
   */
  app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact' 
      , isAuthenticated: req.isAuthenticated()
      , user: req.user}
    );
  });
}

/**
 * Callback function passed to the model to render the homepage
 * @method renderHome
 * @param {http.ServerRequest} req Instance of Node's HTTP server request class
 * @param {http.ServerResponse} res Instance of Node's HTTP server response class
 * @param {Boolean} params.error Indicator if there is an error on the page
 * @param {Array} params.directoryList An array of {Results} containing the searchable main directories
 */
function renderHome(req, res, params) {
  res.render('home', {
      title: 'Audio Search'
    , isAuthenticated: req.isAuthenticated()
    , user: req.user
    , error: params.error
    , dirList: params.directoryList
  });
}

module.exports = routes;

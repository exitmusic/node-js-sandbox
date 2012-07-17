var Search = require('./../models/search');

function routes(app) {
  //TODO(kchang): Standardize parameters passed to views
  app.get('/', function(req, res) {
    var directorySearch = new Search();
    
    directorySearch.getMainDirList(req, res, renderHome);
  });
  app.get('/about', function(req, res) {
    res.render('about', {
        title: 'About'
      , isAuthenticated: req.isAuthenticated()
      , user: req.user}
    );
  });
  app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact' 
      , isAuthenticated: req.isAuthenticated()
      , user: req.user}
    );
  });
}

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

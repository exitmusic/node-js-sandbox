var Search = require('./../models/search');

function routes(app) {
  //TODO(kchang): Standardize parameters passed to views
  app.get('/', function(req, res) {
    var directorySearch = new Search();
    
    directorySearch.getList(req, res, renderHome);
    //renderHome(req, res);
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

function renderHome(req, res, err, directoryList) {
  res.render('home', {
      title: 'Audio Search'
    , isAuthenticated: req.isAuthenticated()
    , error: err
    , user: req.user
    , dirList: directoryList
  });
}

module.exports = routes;

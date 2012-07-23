var Search = require('./../models/search');

function routes(app) {
  app.get('/', function(req, res) {
    var rootSearch = new Search("", [], renderHome);

    if (req.isAuthenticated()) {
      rootSearch.getMainDirList(req, res);
    } else {
      renderHome(req, res, {
          error: true
        , directoryList: ["Log in to see available directories"]
      });
    }
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

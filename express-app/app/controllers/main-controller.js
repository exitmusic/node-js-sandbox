function routes(app) {
  app.get('/', function(req, res) {
    res.render('home', {
      title: 'Audio Search', 
      isAuthenticated: req.isAuthenticated(),
      user: req.user});
  });
}

module.exports = routes;

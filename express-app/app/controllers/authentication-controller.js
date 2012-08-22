var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('./../models/user');

function routes(app) {
  /**
   * Login page. Not authenticated
   */
  app.get('/login', function(req, res) {
    res.render('login', {
      title: 'Login', 
      message: req.flash('error'), 
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
  });
  
  /**
   * Login page. Uses passport-local authentication. See example:
   * https://github.com/jaredhanson/passport-local
   */
  app.post('/login', 
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    });
  );
	
  /**
   * Redirect users to the homepage upon logout.
   */
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

module.exports = routes;

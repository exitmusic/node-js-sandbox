var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, User = require('./../models/user');

function addRoutes(app) {
	app.get('/login', function(req, res) {
		res.render('login', {
			title: 'Login', 
			message: req.flash('error'), 
			isAuthenticated: req.isAuthenticated(),
			user: req.user}
		);
	});
	
	app.post('/loginUser',
			passport.authenticate('local', 
					{successRedirect: '/',
					 failureRedirect: '/login',
					 failureFlash: true})
	);
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
	})
}

module.exports = addRoutes;

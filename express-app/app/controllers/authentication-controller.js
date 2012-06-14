var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, User = require('./../models/user');

function addRoutes(app) {
	app.get('/login', function(req, res) {
		res.render('login', {title: 'Login', message: req.flash('error')});
	});
	
	app.post('/loginUser',
			passport.authenticate('local', 
					{successRedirect: '/',
					 failureRedirect: '/login',
					 failureFlash: true})
	);
}

module.exports = addRoutes;

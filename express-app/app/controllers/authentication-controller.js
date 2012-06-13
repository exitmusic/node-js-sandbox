function addRoutes(app) {
	app.get('/login', function(req, res) {
		res.render('login', {title: 'Login'});
	});
}

module.exports = addRoutes;

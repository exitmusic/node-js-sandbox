
function routes(app) {
	app.get('/', function(req, res) {
	  res.render('index', {
	  	title: 'Audio Search', 
	  	isAuthenticated: req.isAuthenticated(),
	  	user: req.user});
	});
}

module.exports = routes;

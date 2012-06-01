var search = require('./../controllers/search');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.about = function(req, res) {
	res.render('about', {title: 'About'});
};

exports.search = function(req, res) {
	search.process(req, res);
};
var search = require('./../app/controllers/search');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.search = function(req, res) {
	search.process(req, res);
};
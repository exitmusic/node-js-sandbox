
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.about = function(req, res) {
	res.render('about', {layout: false, title: 'About'})
};
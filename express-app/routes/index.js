/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {title: 'Express', page:'home'});
};

//exports.search = function(req, res) {
	//search.process(req, res);
//};

exports.template = function(req, res){
  res.render('template-test', {layout: false, title: 'Template'});
};
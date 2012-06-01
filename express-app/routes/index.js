var fs = require("fs");
var url = require("url");
var query = require("querystring");
var util = require("util");
var exec = require("child_process").exec;

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
	// search code here?
	var query = url.parse(req.url).query;
	var content = "empty";
	
	query = "app";
	exec("ls -l | grep -i " + query, function(err, stdout, stderr) {
		content = stdout;
		res.render('search', {query: content});
	});
};
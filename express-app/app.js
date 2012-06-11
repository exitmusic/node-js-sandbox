
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , searchController = require('./app/controllers/search-controller');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('view options', { layout: false });
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
// TODO Keep all routes here?
app.get('/', routes.index);
app.get('/template', routes.template);

// Controllers
searchController(app);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


/**
 * Module dependencies.
 */

var express = require('express')
	, fs = require('fs')
  , routes = require('./routes')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , user = require('./app/models/user');

var app = module.exports = express.createServer();

// Passport session setup.
//	To support persistent login sessions, Passport needs to be able to
//	serialize users into and deserialize users out of the session.  Typically,
//	this will be as simple as storing the user ID when serializing, and finding
//	the user by ID when deserializing.
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	user.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		user.findByUsername(username, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {message: 'Unknown user'});
			}
			if (user.password !== password) {
				return done(null, false, {message: 'Invalid password'});
			}
			return done(null, user);
		});
	})
);

// Configuration

app.configure(function(){
	app.set('view options', { layout: false });
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.cookieParser()); // added for passport
  app.use(express.bodyParser());
  app.use(express.session({secret: "keyboard cat"})); // added for passport
  app.use(express.methodOverride());
  app.use(passport.initialize()); // added for passport
  app.use(passport.session()); // added for passport
  //app.use(app.router);
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

// Bootstrap controllers
var controllers_path = __dirname + '/app/controllers'
var controller_files = fs.readdirSync(controllers_path)
controller_files.forEach(function(file){
  require(controllers_path+'/'+file)(app)
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

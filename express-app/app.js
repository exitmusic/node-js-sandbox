
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , less = require('less')
  , lessMiddleware = require('less-middleware')
  , flash = require('connect-flash')
  , passport = require('passport')
  , winston = require('winston')
  , expressWinston = require('express-winston')
  , LocalStrategy = require('passport-local').Strategy
  , user = require('./app/models/user');

var app = express();

/**
 * Passport session setup.
 * To support persistent login sessions, Passport needs to be able to
 * serialize users into and deserialize users out of the session.  Typically,
 * this will be as simple as storing the user ID when serializing, and finding
 * the user by ID when deserializing.
 */ 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  user.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
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
    }
  )
);

// Add the user object to the list of request properties to log
expressWinston.requestWhitelist.push('user');

// Configuration
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
	app.set('view options', { layout: false });
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());                    // added for passport
  app.use(express.session({secret: "keyboard cat"})); // added for passport
  app.use(flash());
  app.use(express.methodOverride());
  app.use(passport.initialize());                     // added for passport
  app.use(passport.session());                        // added for passport
  
  // Configure express-winston logger. Should be before the router.
  app.use(expressWinston.logger({
      transports: [
        new winston.transports.File({
            filename: 'logs/access.log'
          , maxsize: 2000000
          , json: true
          , colorize: true
        })
      ]
    , requestFilter: function(req, propName) {
        // Filter the user object to only log the username and email
        if (propName === 'user') {
          return {username: req[propName].username, email: req[propName].email};
        } else { // Log everything else
          return req[propName];
        }
      }
  }));
  app.use(app.router);
  app.use(lessMiddleware({src: __dirname + '/public', compress: true}));
  app.use(express.static(__dirname + '/public'));  
  app.use(express.static('/'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
// Moved all routes to /controllers

// Bootstrap controllers
var controllers_path = __dirname + '/app/controllers';
var controller_files = fs.readdirSync(controllers_path);
controller_files.forEach(function(file) {
  require(controllers_path+'/'+file)(app);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});

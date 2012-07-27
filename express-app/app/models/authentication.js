
// Taken from Jared Hanson's Passport example
// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

//TODO(kchang): In progress
function ensurePermission(req, res, next) {
  if (req.user.directories) {
    //console.log('allowed');
    // compare submitted query string directory with dirKeywords
    return next();
  } 
  res.redirect('/login');
}

exports.ensureAuthenticated = ensureAuthenticated;
exports.ensurePermission = ensurePermission;

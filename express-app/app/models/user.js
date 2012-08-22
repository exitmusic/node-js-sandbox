// No trailing slash
var SEARCH_PATH = '';

var users = [
    { id: 1
    , username: 'bob'
    , password: 'secret'
    , firstName: 'Bob'
    , lastName: 'Bob'
    , email: 'bob@example.com'
    , searchPath: SEARCH_PATH
    , dirKeywords: ['repos', 'tools', 'e', 'a']
    , directories: []}
  , { id: 2
    , username: 'joe'
    , password: 'birthday'
    , firstName: 'Joe'
    , lastName: 'Joe'
    , email: 'joe@example.com'
    , searchPath: SEARCH_PATH
    , dirKeywords: ['tools']
    , directories: []}
  , { id: 3
    , username: 'tom'
    , password: 'cake'
    , firstName: 'Tom'
    , lastName: 'Tom'
    , email: 'tom@example.com'
    , searchPath: SEARCH_PATH
    , dirKeywords: []
    , directories: []}
];

/**
 * Taken from the passport-local example: https://github.com/jaredhanson/passport-local
 * Searches the users array for the given username
 * @method findByUsername
 * @param username The username used to search the users array
 * @param fn Success/failure callback function
 * @returns A callback function containing the user, if found
 */
function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

/**
 * Taken from the passport-local example: https://github.com/jaredhanson/passport-local
 * Searches the users array for the given user id
 * @method findById
 * @param id The user id used to search the users array
 * @param fn Success/failure callback function
 */
function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

exports.findByUsername = findByUsername;
exports.findById = findById;

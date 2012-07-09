//TODO(kchang): Create constructor
var users = [
  {id: 1
    , username: 'bob'
    , password: 'secret'
    , firstName: 'Bob'
    , lastName: 'Bob'
    , email: 'bob@example.com'
    , directories: ['repos', 'tools']
  }
, {id: 2
  , username: 'joe'
  , password: 'birthday'
  , firstName: 'Joe'
  , lastName: 'Joe'
  , email: 'joe@example.com'
  , directories: ['tools']
  }
];

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

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

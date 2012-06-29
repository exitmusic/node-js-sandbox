function Campaign(path, filename, ext) {
  this.path = path;
  this.filename = filename;
  this.ext = ext;
};

Campaign.prototype.someFunction = function() {
  console.log('test function');
};

module.exports = Campaign;

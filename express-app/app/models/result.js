function Result(path, filename, ext) {
  this.path = path;
  this.filename = filename;
  this.ext = ext;
};
/*
function Result(searchTerm, resultsArray, resultsRaw) {
  this.searchTerm = searchTerm;
  this.resultsArray = getResultsArray(searchTerm);
  this.resultsRaw = getResultsRaw(searchTerm);
};
*/

Result.prototype.someFunction = function() {
  console.log('test function');
};

function getResultsArray() {};

function getResultsRaw() {};

module.exports = Result;

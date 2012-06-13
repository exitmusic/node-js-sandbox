function Result(path, filename, ext) {
		this.path = path;
		this.filename = filename;
		this.ext = ext;
};

Result.prototype.someFunction = function() {
	console.log('test function');
};

module.exports = Result;

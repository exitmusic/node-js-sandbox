function Result(path, filename, filetype) {
		this.path = path;
		this.filename = filename;
		this.filetype = filetype;
};

Result.prototype.someFunction = function() {
	console.log('test function');
};

module.exports = Result;

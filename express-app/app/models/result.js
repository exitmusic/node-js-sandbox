/**
 * Holds the details of one search result, usually a folder or a file
 * @constructor
 * @param {String} directory The path to the current folder/file
 * @param {String} filename The directory or file name
 * @param {String} ext If the result is a file, this stores the extension of the file
 * @param {Object} fileDetails Contains the details of the filename such as phone number, email, time 
 * @param {String} fileDetails.phone The outbound phone number of the call
 * @param {String} fileDetails.email The email of the agent making the call
 * @param {String} fileDetails.time The time the call was made
 */
function Result(directory, filename, ext, fileDetails) {
  this.directory = directory;
  this.filename = filename;
  this.ext = ext;
  this.fileDetails = fileDetails;
}

module.exports = Result;

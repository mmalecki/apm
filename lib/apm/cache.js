var path = require('path'),
    nano = require('nano'),
    uuid = require('node-uuid').v1(),
    mkdirp = require('mkdirp');

var Cache = module.exports = function (path) {
  this.path = path;
};

Cache.prototype.add = function (package, callback) {
  var id = uuid.v1(),
      dir = path.join(this.path, id);

  mkdirp(path.join(this.path, id), function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, dir);
  });
};

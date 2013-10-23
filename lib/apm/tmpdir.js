var os = require('os'),
    path = require('path'),
    uuid = require('node-uuid'),
    npmlog = require('npmlog'),
    mkdirp = require('mkdirp');

module.exports = function (cb) {
  var dir = path.join(os.tmpdir(), uuid.v1());
  npmlog.verbose('temp directory', dir);
  mkdirp(dir, function (err) {
    cb(err, dir);
  });
};

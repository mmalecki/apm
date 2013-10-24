var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    npmlog = require('npmlog');

module.exports = function link(from, what, to, cb) {
  async.map(Object.keys(what), function (dest, next) {
    var toFile = path.join(to, dest);
    fs.exists(toFile, function (err, exists) {
      if (err || exists) {
        return next(err || new Error('Cannot override link: ' + toFile));
      }

      mkdirp(path.dirname(toFile), function (err) {
        if (err) {
          return next(err);
        }

        npmlog.verbose('linking', what[dest], toFile);
        fs.symlink(path.join(from, what[dest]), toFile, next);
      });
    });
  }, cb);
}


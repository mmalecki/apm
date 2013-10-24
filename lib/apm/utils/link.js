var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    npmlog = require('npmlog'),
    readPackageJson = require('./read-package-json');

module.exports = function link(dir, prefix, cb) {
  readPackageJson(path.join(dir, 'package.json'), function (err, content) {
    if (err) {
      return cb(err);
    }

    var links = content.links;
    async.forEach(Object.keys(links), function (dest, next) {
      var toFile = path.join(prefix, dest);

      mkdirp(path.dirname(toFile), function (err) {
        if (err) {
          return next(err);
        }

        npmlog.verbose('linking', links[dest], toFile);
        fs.symlink(path.join(dir, links[dest]), toFile, function (err) {
          if (err) {
            if (err.code === 'EEXIST') {
              npmlog.warn('refusing to override', toFile);
              return next();
            }
            else {
              return next(err);
            }
          }
          next();
        });
      });
    }, cb);
  });
}

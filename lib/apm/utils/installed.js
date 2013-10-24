var fs = require('fs'),
    npmlog = require('npmlog'),
    semver = require('semver');

module.exports = function (package, prefix, cb) {
  npmlog.verbose('finding installed package for', package);

  var isChanging = [/^git:\/\//, /^https?:\/\//, /\.\//].some(function (r) {
    return r.test(package);
  });

  var split, version;

  if (isChanging) {
    npmlog.verbose('changing package descriptor');
    return cb(null, null);
  }

  split = package.split('@');
  version = split[1] || '*';

  fs.readdir(path.join(prefix, split[1]), function (cb, content) {
    var satisfying = semver.maxSatisfying(content, version);
    if (satisfying) {
      return cb(null, path.join(prefix, split[1], satisfying));
    }
    else {
      return cb(null, null);
    }
  });
};

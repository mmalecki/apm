var fs = require('fs'),
    path = require('path'),
    npmlog = require('npmlog'),
    semver = require('semver');

module.exports = function (package, installedDir, cb) {
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

  fs.readdir(path.join(installedDir, split[0]), function (err, content) {
    if (err) {
      return cb(err);
    }

    var satisfying = semver.maxSatisfying(content, version);
    npmlog.verbose('found satisfying version', satisfying);
    if (satisfying) {
      return cb(null, path.join(installedDir, split[0], satisfying));
    }
    else {
      return cb(null, null);
    }
  });
};

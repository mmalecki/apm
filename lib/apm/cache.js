var path = require('path'),
    zlib = require('zlib'),
    tar = require('tar'),
    uuid = require('node-uuid'),
    semver = require('semver'),
    mkdirp = require('mkdirp');

var Cache = module.exports = function (path) {
  this.path = path;
};

Cache.prototype.add = function (package, callback) {
  var id = uuid.v1(),
      dir = path.join(this.path, id);

  function got(err, targz) {
    targz
      .pipe(zlib.createGunzip())
      .pipe(tar.Extract({ path: dir }))
      .on('error', function (err) {
        return callback(err);
      })
      .on('end', function () {
        return callback(null, dir);
      });
  }

  mkdirp(dir, function (err) {
    if (err) {
      return callback(err);
    }

    if (package.match(/^git:\/\//)) {
      self.getFromGit(package, dir, got);
    }
    else if (package.match(/^https?:\/\//)) {
      self.getFromHttp(package, dir, got);
    }
    else if (package.indexOf('@') !== -1) {
      // TODO: semver validation
      self.getFromRegistry(package.split('@'), dir, got);
    }
    else {
      callback(new Error('I don\'t know how to install that!'));
    }
  });
};

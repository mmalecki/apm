// It doesn't cache at all yet. XXX
var path = require('path'),
    zlib = require('zlib'),
    uuid = require('node-uuid'),
    semver = require('semver'),
    spawn = require('child_process').spawn,
    mkdirp = require('mkdirp'),
    fstream = require('fstream'),
    npmlog = require('npmlog'),
    tmpdir = require('./tmpdir');

var Cache = module.exports = function (path) {
  this.path = path;
};

Cache.prototype.add = function (package, callback) {
  var id = uuid.v1(),
      dir = path.join(this.path, id),
      self = this;

  npmlog.verbose('cache add', package);

  function got(err, stream) {
    if (err) {
      return callback(err);
    }

    stream
      .pipe(fstream.Writer(dir))
      .on('error', callback)
      .on('close', function () {
        callback(null, dir);
      });
  }

  npmlog.verbose('cache directory', dir);

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
    else if (package.match(/\.\//)) {
      self.getFromFs(package, dir, got);
    }
    else {
      // TODO: semver validation
      self.getFromRegistry(package.split('@'), dir, got);
    }
  });
};

Cache.prototype.getFromGit = function (package, dir, cb) {
  var split = package.split('#'),
      url = split[0];
      branch = split[1] || 'master';

  npmlog.verbose('get from git', url, branch);
  tmpdir(function (err, tmpdir) {
    tmpdir = path.join(tmpdir, 'package');
    var child = spawn('git', [ 'clone', url, '-b', branch, tmpdir ]);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', function (code) {
      if (code !== 0) {
        return cb(new Error('`git` exited with code ' + code));
      }

      cb(null, fstream.Reader(tmpdir));
    });
  });
};

Cache.prototype.getFromFs = function (package, dir, cb) {
  // TODO: make it accept tarballs
  npmlog.verbose('get from fs');
  cb(null, fstream.Reader(package));
};

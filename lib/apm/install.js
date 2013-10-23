var fs = require('fs'),
    async = require('async'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    fstream = require('fstream'),
    rimraf = require('rimraf'),
    npmlog = require('npmlog');

function link(from, what, to, cb) {
  async.map(Object.keys(what), function (dest, next) {
    fs.symlink(path.join(from, what[dest]), path.join(to, dest), next);
  }, cb);
}

module.exports = function (package, cb) {
  var self = this;

  self.cache.add(package, function (err, cachePath) {
    var pkg;

    if (err) {
      return cb(err);
    }

    npmlog.verbose('reading `package.json`');
    fs.readFile(path.join(cachePath, 'package.json'), function (err, content) {
      var installedPath;

      if (err) {
        return cb(err);
      }

      try {
        content = JSON.parse(content);
      }
      catch (err) {
        return cb(err);
      }

      installedPath = path.join(self.installed, content.name, content.version);
      npmlog.verbose('installing', installedPath);

      rimraf(installedPath, function (err) {
        if (err) {
          return cb(err);
        }

        mkdirp(installedPath, function (err) {
          if (err) {
            return cb(err);
          }

          fstream.Reader(cachePath)
            .pipe(fstream.Writer(installedPath))
            .on('error', cb)
            .on('close', function () {
              link(installedPath, content.links, self.prefix, cb);
            });
        });
      });
    });
  });
};

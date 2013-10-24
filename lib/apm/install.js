var fs = require('fs'),
    async = require('async'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    fstream = require('fstream'),
    rimraf = require('rimraf'),
    npmlog = require('npmlog'),
    link = require('./utils/link'),
    readPackageJson = require('./utils/read-package-json');

module.exports = function (package, cb) {
  var self = this;

  npmlog.info('install', package);

  self.cache.add(package, function (err, cachePath) {
    var pkg;

    if (err) {
      return cb(err);
    }

    readPackageJson(path.join(cachePath, 'package.json'), function (err, content) {
      var installedPath;

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
              link(installedPath, self.prefix, function (err) {
                cb(err, installedPath, content.version);
              });
            });
        });
      });
    });
  });
};

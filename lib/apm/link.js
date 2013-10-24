var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    npmlog = require('npmlog'),
    link = require('./utils/link.js'),
    installed = require('./utils/installed.js');

module.exports = function (package, cb) {
  var self = this;

  npmlog.info('linking', package);

  function onInstalled(err, path) {
    if (err) {
      console.dir(err);
      return cb(err);
    }

    link(path, self.prefix, cb);
  }

  installed(package, function (err, path) {
    if (path) {
      onInstalled(err, path);
    }
    else {
      self.install(package, onInstalled);
    }
  });
};

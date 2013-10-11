var fs = require('fs'),
    async = require('async'),
    path = require('path');

function link(from, what, to, cb) {
  async.map(Object.keys(what), function (dest, next) {
    fs.symlink(path.join(from, what[dest]), path.join(to, dest), next);
  }, cb);
}

module.exports = function (package, cb) {
  this.cache.add(package, function (err, path) {
  });
};

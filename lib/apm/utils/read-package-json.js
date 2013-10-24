var fs = require('fs'),
    npmlog = require('npmlog');

module.exports = function readPackageJson(path, cb) {
  npmlog.verbose('reading `package.json`', path);

  fs.readFile(path, function (err, content) {
    if (err) {
      return cb(err);
    }

    try {
      content = JSON.parse(content);
    }
    catch (err) {
      return cb(err);
    }

    cb(null, content);
  });
}

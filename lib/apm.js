var path = require('path'),
    levelup = require('levelup'),
    Cache = require('./apm/cache');

var APM = module.exports = function (options) {
  this.prefix    = options.prefix;
  this.db        = options.db || path.join(this.prefix, 'var', 'lib', 'apm');
  this.level     = levelup(path.join(this.db, 'database'));
  this.cache     = new Cache(options.cache || '/tmp/apm');
  this.installed = options.installed || path.join(this.db, 'installed');
};

APM.prototype.install = require('./apm/install.js');
APM.prototype.link = require('./apm/link.js');

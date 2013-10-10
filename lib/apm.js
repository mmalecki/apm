var path = require('path'),
    levelup = require('levelup'),
    Cache = require('./apm/cache');

var APM = function (options) {
  this.prefix    = options.prefix || process.env.HOME || process.env.USERPROFILE;
  this.db        = options.db || path.join(this.prefix, 'var', 'lib', 'apm/');
  this.level     = levelup(this.db + 'database');
  this.cache     = new Cache(options.cache || '/tmp/apm');
  this.installed = options.installed || path.join(this.db, 'installed');
};

APM.prototype.install = require('./apm/install.js');

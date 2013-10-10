var path = require('path'),
    test = require('tap').test,
    Cache = require('../lib/apm/cache.js');

test('apm/cache', function (t) {
  var cache = new Cache(path.join(__dirname, 'cache'));
});

const ReplaceDottedKeys = require('./lib/replaceDottedKeys');


module.exports = function loopbackMixin(app) {
  app.loopback.modelBuilder.mixins.define('DottedKeysReplace', ReplaceDottedKeys);
};

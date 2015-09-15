require('typescript-require')(require('./tsconfig.json'));

var jsdom = require('jsdom');
var glob = require('glob');

require("babel/register")({
  stage: 0,
  optional: ['runtime'],
  ignore: /node_modules/
});

['.wav', '.css', 'sass', '.scss'].forEach(function (ext) {
  require.extensions[ext] = function (module, filename) {
  };
});

// Setup browser environment so that we can test React components.
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;
global.navigator = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
};
global.console.debug = function () {}; // NodeJS does not have console.debug, but React uses it.

// Load all specs.
glob.sync(__dirname + '/{client,server}/**/__spec__/**/*-spec.js', {}).forEach(function (file) {
  require(file);
});
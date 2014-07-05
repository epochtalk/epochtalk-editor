// Editor JS
module.exports = function(app) {
  app.directive('epochtalkEditor', require(__dirname + './app/js/directive'));
};

// css
require(__dirname + './app/css/style.css');
require(__dirname + './app/css/medium-editor.css');
require(__dirname + './app/css/default.css');
var cssify = require('cssify');
cssify.byUrl('//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css');

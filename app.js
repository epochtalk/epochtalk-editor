// Editor JS
module.exports = function(app) {
  app.directive('epochtalkEditor', require('./app/js/directive'));
};

// css
require('./app/css/style.css');
require('./app/css/medium-editor.css');
require('./app/css/default.css');
var cssify = require('cssify');
cssify.byUrl('//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css');

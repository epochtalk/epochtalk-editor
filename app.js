// require all angular items
require('angular/angular');
require('angular-cookies/angular-cookies');
require('angular-resource/angular-resource');
require('angular-route/angular-route');
require('angular-sanitize/angular-sanitize');

// custom JS
require('./app/js/main');

// css
require('./app/css/style.css');
require('./app/css/medium-editor.css');
require('./app/css/default.css');
var cssify = require('cssify');
cssify.byUrl('//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css');

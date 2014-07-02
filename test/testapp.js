// require angular
require('angular/angular');

// Angular starter app
var app = angular.module('myApp', []);

// Angular Controller:
// Used to supply data to the editor
app.controller('editorCtrl', ['$scope', function($scope) {
  $scope.editorText = '';
  $scope.save = function(text) { $scope.editorText = text; };
}]);

// Epochtalk-editor directive
require('./../app')(app);
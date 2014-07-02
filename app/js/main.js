var bbcodeParser = require('./bbcodeParser');
var xbbcode = require('./xbbcode');
var fs = require('fs');
var medium = require('medium-editor');


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'editorDirectives',
  'editorControllers'
]);


/* Controllers */
angular.module('editorControllers', [])
  .controller('editorCtrl', ['$scope', function($scope) {
    $scope.quote = "quotedData";
    // initial text
    $scope.editorText = '';
    $scope.save = function(text) { $scope.editorText = text; };
  }]);


/* Directives */
angular.module('editorDirectives', [])
  .directive('epochtalkEditor', function() {
    return {
      // require: 'ngModel',
      restrict: 'E',
      scope: {
        text: "=",
        saveText: '&'
      },
      link: function(scope, element, attrs, ctrl) {
        // Find relevant HTML Elements
        var htmlElement = element[0];
        // bbcode editor element
        var editorElement = htmlElement.getElementsByClassName('ee-bbcode-editor')[0];
        editorElement = angular.element(editorElement);
        // bbcode preview element
        var previewElement = htmlElement.getElementsByClassName('ee-bbcode-preview')[0];
        previewElement = angular.element(previewElement);

        // medium options
        var options = {
          "targetBlank":true,
          "buttonLabels":"fontawesome",
          "placeholder": ''
        };
        var editor = new medium(editorElement, options);

        // Medium Editor Event Bindings
        var onChange = function() {
          scope.$apply(function() {
            // process BBCode
            var processed = xbbcode.process({text: editorElement.html()}).html;
            previewElement.html(processed);
            scope.saveText({ text: editorElement.html() });
          });
        };

        // on load ng-model text to editor and preview
        editorElement.html(scope.text);
        var processed = xbbcode.process({text: editorElement.html()}).html;
        previewElement.html(processed);

        editorElement.on('input', onChange);
        editorElement.on('blur', onChange);
      },
      template: fs.readFileSync(__dirname + '/../templates/editor.html')
    };
  });

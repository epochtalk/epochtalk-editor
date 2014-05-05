// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'editorDirectives',
  'editorControllers'
]);


/* Controllers */
angular.module('editorControllers', [])
  .controller('editorCtrl', ['$scope', function($scope) {
    $scope.quote = "quotedData";
    $scope.editorText = "test";

    $scope.save = function(text) {
      $scope.editorText = text;
      // console.log("Controller Text: ");
      // console.log($scope.editorText);
    };

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
      controller: function($scope) {
        // bbcode buttons
        $scope.bbcodeCommand = function(open, close) {
          if (document.activeElement.className.indexOf('ee-bbcode-editor') > 0) { return; }

          // get selection
          var text, selection;
          if (document.selection) { selection = document.selection.createRange().text; }
          else { selection = window.getSelection(); }

          console.log(selection);

          // prepend and append tags
          text = selection.toString();
          var taggedText = open + text + close;

          // append text
          if (selection.rangeCount) {
            var range = selection.getRangeAt(0);
            range.deleteContents();
            var textNode = document.createTextNode(taggedText);
            range.insertNode(textNode);

            // set cursor
            var selRange = document.createRange();
            selRange.setStart(textNode, open.length + text.length);
            selRange.setEnd(textNode, open.length + text.length);
            selection.removeAllRanges();
            // hack to get the cursor to show up in chrome
            setTimeout(function() {
              selection.addRange(selRange);
            }, 1);
          }
        };
      },
      link: function(scope, element, attrs) {
        // directive element
        var htmlElement = element[0];
        // bbcode editor element
        var bbcodeElement = htmlElement.getElementsByClassName('ee-bbcode-editor')[0];
        bbcodeElement = angular.element(bbcodeElement);
        // bbcode preview element
        var previewElement = htmlElement.getElementsByClassName('ee-bbcode-preview')[0];
        previewElement = angular.element(previewElement);

        // on load ng-model text to editor and preview
        bbcodeElement.html(scope.text);
        previewElement.html(scope.text);

        // bind changes to the div to the preview and the parent controller
        var onChange = function() {
          // process BBCode
          var processed = XBBCODE.process({text: bbcodeElement.html()}).html;
          previewElement.html(processed);
          scope.saveText({ text: bbcodeElement.html() });
        };
        bbcodeElement.on('input', onChange);
        bbcodeElement.on('blur', onChange);
      },
      templateUrl: "templates/editor.html"
    };
  });
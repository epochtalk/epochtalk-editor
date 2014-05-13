// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'editorDirectives',
  'editorControllers'
]);


/* Controllers */
angular.module('editorControllers', [])
  .controller('editorCtrl', ['$scope', function($scope) {
    $scope.quote = "quotedData";
    // test code
    $scope.editorText = 'THIS IS TEST CODE!!!\n';
    $scope.editorText += '\nTESTING CODE/PRE/TEXTAREA!!!\n';
    $scope.editorText += '<pre><b>asdf</b><br /></pre>\n';
    $scope.editorText += '<br />\n';
    // test random html
    $scope.editorText += '\nTESTING RANDOM HTML!!!\n';
    $scope.editorText += '<div>random html</div>\n';
    // custom SMF BBCode (Broken????)
    $scope.editorText += "\nTESTING CUSTOM BBCODE!!!\n";
    $scope.editorText += '<span class="BTC">BTC</span>\n';
    // justified html
    $scope.editorText += "\nTESTING JUSTIFICATION!!!\n";
    $scope.editorText += '<div style="text-align: left;">left</div>\n';
    $scope.editorText += '<div align="center">divcenter</div>\n';
    $scope.editorText += '<div style="text-align: right;">FirstRight</div>\n';
    $scope.editorText += '<div style="text-align: right;"><div>SecondRight</div><div><div></div></div></div>\n';
    $scope.editorText += '<center>centertext</center>\n';
    // font
    $scope.editorText += '\nTESTING FONT COLORS!!!\n';
    $scope.editorText += '<span style="color: black">black</span>\n';
    $scope.editorText += '<span style="color: blue">blue</span>\n';
    $scope.editorText += '<span style="color: green;">green</span>\n';
    $scope.editorText += '<span style="color: red;">red</span>\n';
    $scope.editorText += '<span style="color: white;">white</span>\n';
    $scope.editorText += '<span style="color:#888888;">888888</span>\n';
    $scope.editorText += '\nTESTING FONT FACE!!!\n';
    $scope.editorText += '<span style="font-family: Georgia;">Georgia</span>\n';
    $scope.editorText += '<span style="font-family: Times New Roman;">Times New Roman</span>\n';
    $scope.editorText += '\nTESTING FONT SIZE!!!\n';
    $scope.editorText += '<span style="font-size: 24px; !important; line-height: 1.3em;" >font size</span>\n';
    $scope.editorText += '<span style="font-size: 10pt;">font size only</span>\n';
    $scope.editorText += '\nTESTING TEXT DIRECTION!!!\n';
    $scope.editorText += '<div dir="ltr">left to right</div>\n';
    $scope.editorText += '<div dir="rtl">right to left</div>\n';
    $scope.editorText += '\nTESTING TABLES!!!\n';
    $scope.editorText += '<table>\n';
    $scope.editorText += '<thead>\n';
    $scope.editorText += '<tr><td>Table</td></tr>\n';
    $scope.editorText += '<tr><td>head</td></tr>\n';
    $scope.editorText += '</thead>\n';
    $scope.editorText += '<tfoot>\n';
    $scope.editorText += '<tr><td>Table</td></tr>\n';
    $scope.editorText += '<tr><td>foot</td></tr>\n';
    $scope.editorText += '</tfoot>\n';
    $scope.editorText += '<tr><td>Table</td></tr>\n';
    $scope.editorText += '<tr><td>Body</td></tr>\n';
    $scope.editorText += '</table>\n';
    $scope.editorText += '\n<table>\n';
    $scope.editorText += '<tr><th>Table Head</th></tr>\n';
    $scope.editorText += '<tr><td>Body</td></tr>\n';
    $scope.editorText += '</table>\n';
    $scope.editorText += '\nTESTING UNDERLING BBCODE STYLE!!!\n'
    $scope.editorText += '<span style="text-decoration: underline;">underline</span>\n';
    $scope.editorText += '\nTESTING ANCHORS!!!\n';
    $scope.editorText += '<a href="http://www.google.com">internal url</a>\n';
    $scope.editorText += '<a href="http://www.google.com" style="display: inherit;">internal url with attr</a>\n';
    $scope.editorText += '<a href="ftp://www.google.com" style="display: inherit;">ftp google</a>\n';
    $scope.editorText += '<a href="http://www.google.com" target="_blank">external URL</a>\n';
    $scope.editorText += '<a href="mailto:taesup63@gmail.com" style="display: inherit;"">email</a>\n';

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
        // Find relevant HTML Elements
        var htmlElement = element[0];
        // bbcode editor element
        var bbcodeElement = htmlElement.getElementsByClassName('ee-bbcode-editor')[0];
        bbcodeElement = angular.element(bbcodeElement);
        // bbcode preview element
        var previewElement = htmlElement.getElementsByClassName('ee-bbcode-preview')[0];
        previewElement = angular.element(previewElement);

        // on load ng-model text to editor and preview
        var bbcode = convert(scope.text);
        bbcodeElement.text(bbcode);
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
##Epochtalk-Editor  

Epochtalk-Editor is a online WYSIWYG text editor built into the epochtalk forum. This editor is built with AngularJS, Napa, Browserify, CSSify, BRFS, Browserify-ngmin, and Uglify.  

To setup this editor's dependencies:  
```
npm install
```  
This will install all the tools mentioned above and will use napa to bring down the latest copy of AngularJS from the Bower-Angular Github repo.

To build this editor use:  
```
npm run build
```  
This will run Browserify with CSSify and BRFS to bundle all the js/css into one file. Then Uglify is used to minify, compress, and remove unused code. The final file is left in the public/js dir. 


To run this editor as a standalone:  
```
npm run start
```  
This will bring up a instance of node webserver running on port 8080. 
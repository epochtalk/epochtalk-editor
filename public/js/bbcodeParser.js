function item(pos, font, face, size, color) {
  this.pos = pos;
  this.font = font;
  this.face = face;
  this.size = size;
  this.color = color;
}

anchorlist = new item(50);
textarealist = new item(20);

function do_anchor(fonttext) {
  var i = 0;
  var j = 0;
  var n;
  var pos;
  var subfonttext;
    
  fonttext = fonttext.toUpperCase();
  
  for (pos = 0; pos != -1; pos) {
    // find start of open tag
    pos = fonttext.indexOf("<A HREF", pos);
    
    // if <A HREF is found
    if (pos != -1) {
      // find end of open tag
      n = fonttext.indexOf(">", pos);
    
      anchorlist[i] = new item(0, 0, 0, 0, 0);
      anchorlist[i].font = 1;

      // contents of open tag
      subfonttext = fonttext.substring(pos, n);

      // if email tag
      if (subfonttext.search(/MAILTO:/) != -1) {
        var startEmailIndex = subfonttext.indexOf("MAILTO:");
        var endEmailIndex = subfonttext.indexOf('"', startEmailIndex);
        var email = subfonttext.substring(startEmailIndex + 7, endEmailIndex);

        email = email.trim();
        email = email.replace(/\"/g, "");
        email = email.replace(/\'/g, "");
        
        anchorlist[i].pos = 1; // mailto: flag
        email = email.toLowerCase();
        anchorlist[i].face = email; // email address
      }
      // handle ftp
      else if (subfonttext.search(/FTP:/) != -1) {
        var startFTPIndex = subfonttext.indexOf("FTP:");
        var endFTPIndex = subfonttext.indexOf('"', startFTPIndex);
        var ftp = subfonttext.substring(startFTPIndex + 4, endFTPIndex);

        ftp = ftp.trim();
        ftp = ftp.replace(/\"/g, "");
        ftp = ftp.replace(/\'/g, "");

        anchorlist[i].pos = 3; // ftp: flag
        ftp = ftp.toLowerCase();
        anchorlist[i].face = ftp; // ftp address
      }
      // handle internal url
      else if (subfonttext.search(/TARGET=/) != -1){
        var startURLIndex = subfonttext.indexOf("HREF=");
        var endURLIndex = subfonttext.indexOf('"', startURLIndex);
        // account for first " mark, if it exists
        if (endURLIndex === (startURLIndex + 5)) {
          endURLIndex = subfonttext.indexOf('"', endURLIndex + 1);
        }
        var url = subfonttext.substring(startURLIndex + 5, endURLIndex);

        url = url.trim();
        url = url.replace(/\"/g, "");
        url = url.replace(/\'/g, "");

        anchorlist[i].pos = 2; // http: flag
        url = url.toLowerCase();
        anchorlist[i].face = url;
      }
      else {
        var startIURLIndex = subfonttext.indexOf("HREF=");
        var endIURLIndex = subfonttext.indexOf('"', startIURLIndex);
        // account for first " mark, if it exists
        if (endIURLIndex === (startIURLIndex + 5)) {
          endIURLIndex = subfonttext.indexOf('"', endIURLIndex + 1);
        }
        var iurl = subfonttext.substring(startIURLIndex + 5, endIURLIndex);

        iurl = iurl.trim();
        iurl = iurl.replace(/\"/g, "");
        iurl = iurl.replace(/\'/g, "");

        anchorlist[i].pos = 4; // internal http: flag
        iurl = iurl.toLowerCase();
        anchorlist[i].face = iurl;
      }
      
      pos++;
      i++;
    }  // end if <A HREF is found
    else {
      anchorlist[i] = new item(0, 0, 0, 0, 0);
      anchorlist[i].pos = 0; // no more anchors flag
    }
    //i--;  // so i equals the length of fontlist
  }  // end for
}  //  end function do_anchor()

// this function copies all the textarea data to strings
// to preserve its code exactly as it is and not change it
function do_textarea(fonttext) {
  var i = 0;
  var j = 0;
  var n;
  var pos;
  var subfonttext;
    
  textareatext = fonttext;  // need this to preserve case
  fonttext = fonttext.toUpperCase();
  
  for (pos = 0; pos != -1; pos) {
    pos = fonttext.indexOf("<TEXTAREA", pos);
    
    if (pos != -1) { // if <TEXTAREA is found
      n = fonttext.indexOf(">", pos);
      pos = fonttext.indexOf("</TEXTAREA>", n);
      if (pos != -1) { // if </TEXTAREA> is found
        textarealist[i] = new item(0, 0, 0, 0, 0);
        textarealist[i].face = textareatext.substring(n+1, pos);
        // notice that we copied the area from textareatext
        // because it has not had its case changed to upper
        textarealist[i].pos = 1;
      }

      pos++;
      i++;
    }  // end if <TEXTAREA is found
    else {
      textarealist[i] = new item(0, 0, 0, 0, 0);
      textarealist[i].pos = 0; // no more textareas flag
    }
  }  // end for
}  //  end function do_textarea()

function searchForTag(startIndex, openTag, closeTag, text) {
  var openTagIndex = startIndex + 4;
  var closeTagIndex = startIndex + 4;
  var endIndex = -1;
  var watchdog = 50;
  
  // set up depth search
  var innerSearch = false;
  if (startIndex > -1) { innerSearch = true; }

  // search through child nodes
  while (innerSearch) {
    // look for start and end tags
    openTagIndex = text.indexOf(openTag, openTagIndex);
    closeTagIndex = text.indexOf(closeTag, closeTagIndex);

    // error case: no closing tag found
    if (closeTagIndex < 0) { endIndex = -1; innerSearch = false; }

    // both tags found
    if (openTagIndex > -1 && closeTagIndex > -1) {
      // secondary found case: close is before open
      if (openTagIndex > closeTagIndex) {
        endIndex = closeTagIndex;
        innerSearch = false;
      }

      // iterate again
      openTagIndex = openTagIndex + 4;
      closeTagIndex = closeTagIndex + 4;
    }

    // found case: no open tag, close tag found
    if (openTagIndex < 0 && closeTagIndex > -1) {
      endIndex = closeTagIndex;
      innerSearch = false;
    }

    // major error case: return index and kill loop
    watchdog--;
    if (watchdog < 0) { endIndex = -1; innerSearch = false; }
  }

  return endIndex;
} // end function searchForTag()

function handleJustification(justText) {
  var searchRight = true;
  while (searchRight) {
    // see if it exists at all
    var rightIndex = justText.indexOf('<div style="text-align: right;">');
    var rightEndIndex = searchForTag(rightIndex, "<div", "</div", justText);

    // if <div style="text-align: right" found
    if (rightIndex > -1 && rightEndIndex > -1) {
      var rightText = justText.substring(rightIndex + 32, rightEndIndex);
      justText = [justText.slice(0, rightIndex), "[right]", rightText, "[/right]", justText.slice(rightEndIndex + 6)].join('');
    }
    else { searchRight = false; }
  }

  // handle div align="center"
  var searchCenter = true;
  while (searchCenter) {
    // handle <div align="center"
    var centerIndex = justText.indexOf('<div align="center">');
    var centerEndIndex = searchForTag(centerIndex, "<div", "</div", justText);
    
    // if <div align="center"> found
    if (centerIndex > -1 && centerEndIndex > -1) {
      var centerText = justText.substring(centerIndex + 20, centerEndIndex);
      justText = [justText.slice(0, centerIndex), "[center]", centerText, "[/center]", justText.slice(centerEndIndex + 6)].join('');
    }
    else { searchCenter = false; }
  }

  // handle <center>
  searchCenter = true;
  while (searchCenter) {
    // handle <div align="center"
    var centerTagIndex = justText.indexOf('<center>');
    var centerTagEndIndex = justText.indexOf("</center>", centerTagIndex);
    // if <div align="center"> found
    if (centerTagIndex > -1 && centerTagEndIndex > -1) {
      var centerTagText = justText.substring(centerTagIndex + 8, centerTagEndIndex);
      justText = [justText.slice(0, centerTagIndex), "[center]", centerTagText, "[/center]", justText.slice(centerTagEndIndex + 9)].join('');
    }
    else { searchCenter = false; }
  }

  // handle [left]
  var searchLeft = true;
  while (searchLeft) {
    var leftIndex = justText.indexOf("<div style=\"text-align: left;\">");
    var leftEndIndex = searchForTag(leftIndex, "<div", "</div", justText);
    // if [right] found
    if (leftIndex > -1 && leftEndIndex > -1) {
      var leftText = justText.substring(leftIndex + 31, leftEndIndex);
      justText = [justText.slice(0, leftIndex), "[left]", leftText, "[/left]", justText.slice(leftEndIndex + 6)].join('');
    }
    else { searchLeft = false; }
  }

  return justText;
} // end function handleJustification()

function handleFontColor(justText) {
  var searchFont = true;
  while (searchFont) {
    var fontIndex = justText.indexOf('<span style="color:');
    var fontCloseIndex = justText.indexOf(">", fontIndex);
    var fontValue = justText.substring(fontIndex + 19, fontCloseIndex);
    fontValue = fontValue.trim(); // remove white space
    fontValue = fontValue.replace('"', ""); // remove trailing "
    fontValue = fontValue.replace("'", ""); // remove trailing '
    fontValue = fontValue.replace(";", ""); // remove trailing ;
    var fontEndIndex = searchForTag(fontIndex, "<span", "</span", justText);
    // if tag found
    if (fontIndex > -1 && fontEndIndex > -1) {
      var fontText = justText.substring(fontCloseIndex+1, fontEndIndex);
      justText = [justText.slice(0, fontIndex), "[color=" + fontValue + "]", fontText, "[/color]", justText.slice(fontEndIndex + 7)].join('');
    }
    else { searchFont = false; }
  }

  return justText;
}

function handleFontFace(justText) {
  var searchFont = true;
  while (searchFont) {
    var fontIndex = justText.indexOf('<span style="font-family:');
    var fontCloseIndex = justText.indexOf(">", fontIndex);
    var fontValue = justText.substring(fontIndex + 25, fontCloseIndex);
    fontValue = fontValue.trim(); // remove white space
    fontValue = fontValue.replace('"', ""); // remove trailing "
    fontValue = fontValue.replace("'", ""); // remove trailing '
    fontValue = fontValue.replace(";", ""); // remove trailing ;
    var fontEndIndex = searchForTag(fontIndex, "<span", "</span", justText);
    // if tag found
    if (fontIndex > -1 && fontEndIndex > -1) {
      var fontText = justText.substring(fontCloseIndex+1, fontEndIndex);
      justText = [justText.slice(0, fontIndex), "[font=" + fontValue + "]", fontText, "[/font]", justText.slice(fontEndIndex + 7)].join('');
    }
    else { searchFont = false; }
  }

  return justText;
}

function handleFontSize(justText) {
  var searchFont = true;
  while (searchFont) {
    var fontIndex = justText.indexOf('<span style="font-size:');
    var fontValueIndex = justText.indexOf("p", fontIndex+4);
    var fontValue = justText.substring(fontIndex + 23, fontValueIndex+2);
    fontValue = fontValue.trim(); // remove white space
    fontValue = fontValue.replace('"', ""); // remove trailing "
    fontValue = fontValue.replace("'", ""); // remove trailing '
    fontValue = fontValue.replace(";", ""); // remove trailing ;
    var fontCloseIndex = justText.indexOf(">", fontIndex);
    var fontEndIndex = searchForTag(fontIndex, "<span", "</span", justText);
    // if tag found
    if (fontIndex > -1 && fontEndIndex > -1) {
      var fontText = justText.substring(fontCloseIndex+1, fontEndIndex);
      justText = [justText.slice(0, fontIndex), "[size=" + fontValue + "]", fontText, "[/size]", justText.slice(fontEndIndex + 7)].join('');
    }
    else { searchFont = false; }
  }

  return justText;
}

function handleTextDirection(justText) {
  var searchLeftDirection = true;
  while (searchLeftDirection) {
    var dirLeftIndex = justText.indexOf('<div dir="ltr">');
    var dirLeftEndIndex = searchForTag(dirLeftIndex, "<div", "</div", justText);
    // if tag found
    if (dirLeftIndex > -1 && dirLeftEndIndex > -1) {
      var dirLeftText = justText.substring(dirLeftIndex+15, dirLeftEndIndex);
      justText = [justText.slice(0, dirLeftIndex), "[ltr]", dirLeftText, "[/ltr]", justText.slice(dirLeftEndIndex + 6)].join('');
    }
    else { searchLeftDirection = false; }
  }

  var searchRightDirection = true;
  while (searchRightDirection) {
    var dirRightIndex = justText.indexOf('<div dir="rtl">');
    var dirRightEndIndex = searchForTag(dirRightIndex, "<div", "</div", justText);
    // if tag found
    if (dirRightIndex > -1 && dirRightEndIndex > -1) {
      var dirRightText = justText.substring(dirRightIndex+15, dirRightEndIndex);
      justText = [justText.slice(0, dirRightIndex), "[rtl]", dirRightText, "[/rtl]", justText.slice(dirRightEndIndex + 6)].join('');
    }
    else { searchRightDirection = false; }
  }

  return justText;
}

function handleUnderline(justText) {
  var searchUnderline = true;
  while (searchUnderline) {
    var underlineIndex = justText.indexOf('<span style="text-decoration: underline;">');
    var underlineEndIndex = searchForTag(underlineIndex, "<span", "</span", justText);
    // if tag found
    if (underlineIndex > -1 && underlineEndIndex > -1) {
      var underlineText = justText.substring(underlineIndex+42, underlineEndIndex);
      justText = [justText.slice(0, underlineIndex), "[u]", underlineText, "[/u]", justText.slice(underlineEndIndex + 7)].join('');
    }
    else { searchUnderline = false; }
  }

  return justText;
}

function convert(bbcodetext) {
  // handle left/right/center justification
  bbcodetext = handleJustification(bbcodetext);
  bbcodetext = handleFontColor(bbcodetext);
  bbcodetext = handleFontFace(bbcodetext);
  bbcodetext = handleFontSize(bbcodetext);
  bbcodetext = handleTextDirection(bbcodetext);
  bbcodetext = handleUnderline(bbcodetext);

  // handle code/pre/textarea/script to not format html -> bbcode
  bbcodetext = bbcodetext.replace(/<CODE>/gi, "<TEXTAREA>");
  bbcodetext = bbcodetext.replace(/<\/CODE>/gi, "</TEXTAREA>");
  bbcodetext = bbcodetext.replace(/<PRE[^>]*>/gi, "<TEXTAREA>");
  bbcodetext = bbcodetext.replace(/<\/PRE>/gi, "</TEXTAREA>");
  bbcodetext = bbcodetext.replace(/<PRE>/gi, "<TEXTAREA>");
  bbcodetext = bbcodetext.replace(/<\/PRE>/gi, "</TEXTAREA>");
  bbcodetext = bbcodetext.replace(/<SCRIPT[^>]*>/gi, "<TEXTAREA>");
  bbcodetext = bbcodetext.replace(/<\/SCRIPT>/gi, "</TEXTAREA>");
  do_textarea(bbcodetext);

  // custom BBCode
  bbcodetext = bbcodetext.replace(/<SPAN CLASS="BTC">BTC<\/SPAN>/gi, "[btc]");
  
  // remove spaces around the = 
  bbcodetext = bbcodetext.replace(/ = /gi, "=");

  bbcodetext = bbcodetext.replace(/\s+BORDER=[^\'\">]*[\'\">]/gi, "");
  // bbcodetext = bbcodetext.replace(/\s+TARGET=[^\'\">]*[\'\">]/gi, "");
  bbcodetext = bbcodetext.replace(/\s+CLASSID=[^\'\">]*[\'\">]/gi, "");
  bbcodetext = bbcodetext.replace(/\s+ID=[^\'\">]*[\'\">]/gi, "");
  bbcodetext = bbcodetext.replace(/\s+NAME=[^\'\">]*[\'\">]/gi, "");
  //bbcodetext = bbcodetext.replace(/\s+ALIGN=[^\"]*\"/gi, "");
  //bbcodetext = bbcodetext.replace(/\s+ALIGN=[^\']*\'/gi, "");
  //bbcodetext = bbcodetext.replace(/\s+ALIGN=[^>]*>/gi, ">");
  //bbcodetext = bbcodetext.replace(/\s+STYLE=[^\'\">]*[\'\">]/gi, "");
  //bbcodetext = bbcodetext.replace(/\s+STYLE=[^\'>]*\'/gi, "");
  //bbcodetext = bbcodetext.replace(/\s+CLASS=[^\'\">]*[\'\">]/gi, "");
  //bbcodetext = bbcodetext.replace(/\s+CLASS=[^\'>]*\'/gi, "");
  bbcodetext = bbcodetext.replace(/\s+ALT=[^\'\">]*[\'\">]/gi, "");
  bbcodetext = bbcodetext.replace(/\s+TITLE=[^\'\">]*[\'\">]/gi, "");
  bbcodetext = bbcodetext.replace(/\s+REL=[^\'\">]*[\'\">]/gi, "");
  bbcodetext = bbcodetext.replace(/\s+ONCLICK=[^\'\">]*[\'\">]/gi, "");
  /* 10-5-11 - Above I replaced: .replace(/ BORDER 
    with: .replace(/\s*BORDER
    to replace by all whitespace including new line
  */
  //(\"[^\"]*\"|\'[^\']*\'|\w[^>\'\"\s]*) from strip.php
  
  // 10-5-11 - Replace all <A whitespace HREF with just a space so our functions below work
  bbcodetext = bbcodetext.replace(/<A\s*HREF/gi, "<A HREF");
  do_anchor(bbcodetext);
  
  bbcodetext = bbcodetext.replace(/<BR>/gi, "[br]");
  bbcodetext = bbcodetext.replace(/<BR(.*?)\/>/gi, "[br]");
  bbcodetext = bbcodetext.replace(/<P>/gi, "\r\r");
  bbcodetext = bbcodetext.replace(/<P [^>]*>/gi, "\r\r");
  bbcodetext = bbcodetext.replace(/<BLOCKQUOTE>/gi, "[quote]");
  bbcodetext = bbcodetext.replace(/<\/BLOCKQUOTE>/gi, "[/quote]");
  bbcodetext = bbcodetext.replace(/<UL[^>]*>/gi, "[ul]");
  bbcodetext = bbcodetext.replace(/<\/UL>/gi, "[/ul]");
  bbcodetext = bbcodetext.replace(/<OL[^>]*>/gi, "[ol]");
  bbcodetext = bbcodetext.replace(/<\/OL>/gi, "[/ol]");
  bbcodetext = bbcodetext.replace(/<LI>/gi, "[*]");

  // *** how are we handling images?

  // *** Jeff!! These two remarked statements are the solution
  // to make a better converter:
  // (.*?) = match any character except new line 0 or more times and remember the match
  // ([\s\S]*?) = match \s any white space char once inclduing \n, 
  // \S match any non-white space char, *? any number of times or 0 times
  //bbcodetext = bbcodetext.replace(/<A[\s\S]*?HREF=\"(.*?)\"[\s\S]*?>([\s\S]*?)<\/A>/gi, "[url=$1]$2[\/url]");
  bbcodetext = bbcodetext.replace(/<IMG[\s\S]*?SRC=([\s\S]*?)\"[\s\S]*?>/gi, "[img]$1[\/img]");
  bbcodetext = bbcodetext.replace(/<IMG[\s\S]*?SRC=([\s\S]*?)'[\s\S]*?>/gi, "[img]$1[\/img]");
  
  bbcodetext = bbcodetext.replace(/<BIG>/gi, "[b]");
  bbcodetext = bbcodetext.replace(/<\/BIG>/gi, "[/b]");
  bbcodetext = bbcodetext.replace(/<STRONG>/gi, "[b]");
  bbcodetext = bbcodetext.replace(/<\/STRONG>/gi, "[/b]");
  bbcodetext = bbcodetext.replace(/<B>/gi, "[b]");
  bbcodetext = bbcodetext.replace(/<\/B>/gi, "[/b]");
  bbcodetext = bbcodetext.replace(/<U>/gi, "[u]");
  bbcodetext = bbcodetext.replace(/<\/U>/gi, "[/u]");
  bbcodetext = bbcodetext.replace(/<I>/gi, "[i]");
  bbcodetext = bbcodetext.replace(/<\/I>/gi, "[/i]");
  bbcodetext = bbcodetext.replace(/<EM>/gi, "[i]");
  bbcodetext = bbcodetext.replace(/<\/EM>/gi, "[/i]");
  bbcodetext = bbcodetext.replace(/<h\d>/gi, "\r\r[b]");
  bbcodetext = bbcodetext.replace(/<\/h\d>/gi, "[/b]");
  bbcodetext = bbcodetext.replace(/&nbsp;/gi, " ");
  bbcodetext = bbcodetext.replace(/<SUP>/gi, "[sup]");
  bbcodetext = bbcodetext.replace(/<\/SUP>/gi, "[/sup]");
  bbcodetext = bbcodetext.replace(/<SUB>/gi, "[sub]");
  bbcodetext = bbcodetext.replace(/<\/SUB>/gi, "[/sub]");
  bbcodetext = bbcodetext.replace(/<HR[^>]*>/gi, "[hr]");
  bbcodetext = bbcodetext.replace(/<DEL>/gi, "[s]");
  bbcodetext = bbcodetext.replace(/<\/DEL>/gi, "[/s]");
  bbcodetext = bbcodetext.replace(/<STRIKE>/gi, "[s]");
  bbcodetext = bbcodetext.replace(/<\/STRIKE>/gi, "[/s]");
  bbcodetext = bbcodetext.replace(/<TEXTAREA[^>]*>/gi, "[code]");
  bbcodetext = bbcodetext.replace(/<\/TEXTAREA>/gi, "[/code]");
  bbcodetext = bbcodetext.replace(/<THEAD[^>]*>/gi, "[thead]");
  bbcodetext = bbcodetext.replace(/<\/THEAD>/gi, "[/thead]");
  bbcodetext = bbcodetext.replace(/<TABLE[^>]*>/gi, "[table]");
  bbcodetext = bbcodetext.replace(/<TR[^>]*>/gi, "[tr]");
  bbcodetext = bbcodetext.replace(/<TD[^>]*>/gi, "[td]");
  bbcodetext = bbcodetext.replace(/<TH[^>]*>/gi, "[th]");
  bbcodetext = bbcodetext.replace(/<\/TABLE>/gi, "[/table]");
  bbcodetext = bbcodetext.replace(/<\/TR>/gi, "[/tr]");
  bbcodetext = bbcodetext.replace(/<\/TD>/gi, "[/td]");
  bbcodetext = bbcodetext.replace(/<\/TH>/gi, "[/th]");
  bbcodetext = bbcodetext.replace(/<TBODY[^>]*>/gi, "[tbody]");
  bbcodetext = bbcodetext.replace(/<\/TBODY>/gi, "[/tbody]");
  bbcodetext = bbcodetext.replace(/<TFOOT[^>]*>/gi, "[tfoot]");
  bbcodetext = bbcodetext.replace(/<\/TFOOT>/gi, "[/tfoot]");
  bbcodetext = bbcodetext.replace(/<TT>/gi, "[tt]");
  bbcodetext = bbcodetext.replace(/<\/TT>/gi, "[/tt]");
    
  // The following for loop is to search anchor tags
  // to have the right closing for mailto or http.
  // It also does </A> tags
  // we remove the global case in the replace function
  for (i = 0; anchorlist[i].pos !== 0; i++) {
    if (anchorlist[i].pos == 4) {  // if iurl
      var startIURL = bbcodetext.indexOf("<A HREF=", 0);
      var endIURL = bbcodetext.indexOf(">", startIURL);

      if (startIURL > -1 && endIURL > -1) {
        var iurl = anchorlist[i].face;
        bbcodetext = [bbcodetext.slice(0, startIURL), "[iurl=", iurl, "]", bbcodetext.slice(endIURL+1)].join('');
        bbcodetext = bbcodetext.replace(/<\/A>/i, "[/iurl]");
      }
    }
    if (anchorlist[i].pos == 3) {  // if FTP
      var startFTP = bbcodetext.indexOf("<A HREF=", 0);
      var endFTP = bbcodetext.indexOf(">", startFTP);

      if (startFTP > -1 && endFTP > -1) {
        var ftp = anchorlist[i].face;
        bbcodetext = [bbcodetext.slice(0, startFTP), "[ftp=ftp:", ftp, "]", bbcodetext.slice(endFTP+1)].join('');
        bbcodetext = bbcodetext.replace(/<\/A>/i, "[/ftp]");
      }
    }
    if (anchorlist[i].pos == 2) { // if URL
      var startURL = bbcodetext.indexOf("<A HREF=", 0);
      var endURL = bbcodetext.indexOf(">", startURL);

      if (startURL > -1 && endURL > -1) {
        var url = anchorlist[i].face;
        bbcodetext = [bbcodetext.slice(0, startURL), "[url=", url, "]", bbcodetext.slice(endURL+1)].join('');
        bbcodetext = bbcodetext.replace(/<\/A>/i, "[/url]");
      }
    }  // end if URL
    if (anchorlist[i].pos == 1) { // if mailto:
      var startEmail = bbcodetext.indexOf("<A HREF=", 0);
      var endEmail = bbcodetext.indexOf(">", startEmail);

      if (startEmail > -1 && endEmail > -1) {
        var email = anchorlist[i].face;
        bbcodetext = [bbcodetext.slice(0, startEmail), "[email=", email, "]", bbcodetext.slice(endEmail+1)].join('');
        bbcodetext = bbcodetext.replace(/<\/A>/i, "[/email]");
      }
    }  // end if mailto:
  }  // end for loop for anchor tags
            
  // This replaces all remaining HTML code between < and >
  // bbcodetext = bbcodetext.replace(/<[^>]*>/g, "");
  
  // The following for loop searches through all textareas.
  // It takes place after all < > tags have been removed
  // because it needs to go back in and put all the data
  // back into the <TEXTAREA></TEXTAREA> tags unchanged.
  for (i = 0; textarealist[i].pos !== 0; i++) {
    if (textarealist[i].pos == 1) {
      // turn textarea to BB Codes [code] tag
      bbcodetext = bbcodetext.replace(/\[code\][\w\W]*?\[\/code\]/i, "[code]" + textarealist[i].face + "[/code]");
    }  // end if TEXTAREA
  }  // end for loop for textarea tags
  
  return bbcodetext;
} // end function convert()

console.log("Studio Enhance extension loaded");

var getStudioTab = function(){
  var url = document.location.href;

  var res = "";

  var urlTabs = url.split("/tab/");

  if (urlTabs && urlTabs != null && urlTabs.length > 0){
     var res = urlTabs[urlTabs.length - 1].split("/")[0].split("?")[0];
     res = decodeURIComponent(res).split(":");
     res = res[res.length - 1];
  }

  return res;
}

var setFullScreenLink = function(editor){
  var id = "FullScreenLink" + editor.getTextArea().id;

  var link = "<span class='FullScreenLink'><a id='" + id + "' href='#'>Go Fullscreen (Esc to exit)</a></span>";
  var cd = $(editor.getWrapperElement());

  cd.prepend(link);
  $("#" + id).on("click", function(e){
    e.preventDefault();
    var isFullscreen = editor.getOption("fullScreen");

    editor.setOption("fullScreen", !isFullscreen);
    $("#" + id).text(function(i, old){
      if (isFullscreen){
        return "Go Fullscreen (Esc to exit)";
      }else{
        return "Exit Fullscreen (or press Esc)";
      }  
    });
    
  });  

}

var getEditorOption = function(mode, callback){
  var syntaxHighlight = true;
  var lineNumbers = true;
  var wrapLines = true;
  var matchTag = true;
  var matchBracket = true;
  var codeHint = true;
  var theme = null;

 chrome.storage.sync.get({
    syntaxHighlight: true,
    lineNumbers: true,
    wrapLines : true,
    matchTag: true,
    matchBracket : true,
    codeHint : true,
    theme: null
  }, function(items) {
    	var options = {
        	mode: mode,
         	lineNumbers: items.lineNumbers,
         	lineWrapping: items.wrapLines,
         	foldGutter: {
                        rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
         	},
         	gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
         	matchTags: {bothTags: items.matchTag},
         	matchBrackets: items.matchBracket,      
          styleActiveLine: true,    
	     	  extraKeys: {
            	"'<'": completeAfter,
            	"'/'": completeIfAfterLt,
            	"' '": completeIfInTag,
            	"'='": completeIfInTag,
            	"Ctrl-Space": "autocomplete",
              "Esc" : function(cm) {
                    if (cm.getOption("fullScreen")) {
                        cm.setOption("fullScreen", false);
                        $('[id^="FullScreenLink"]').text("Go Fullscreen (Esc to exit)");
                    }
              }
         	}
    	};


      if (items.theme && items.theme != null && items.theme != "" ){
        options.theme = items.theme;
        //This would have loaded the theme CSS dynamically but
        //the web_accessible_resources manifest setting doesn't seem to work
        /* var css = "/css/themes/" + items.theme + ".css";
        console.log("Selected theme " + css);
        var link = document.createElement('link');
        link.href =  chrome.extension.getURL(css);
        //chrome-extension://<extension id>/main.css
        link.rel = 'stylesheet';
        document.getElementsByTagName("head")[0].appendChild(link); */
      } else {
        options.theme = "default";
      }

    	if (codeHint)
    		options.hintOptions = {schemaInfo: tags};
    	if (!items.syntaxHighlight){
    		options.mode = "";
    	}

    	callback(options);
  });

};




var empty = {
	children: []
};
var _break = {
children: ["#break"]
};

var _return = {
	children : ["#return"]
};

  var tags = {
    "!top": ["#if","#assign","#list","#switch","#macro","#function","#import","#include","#attempt","#noparse","#compress","#global","#local",
			"#setting","#flush","#stop","#ftl","#t","#lt","#rt","#nt","#visit","#recurse","#fallback"],
    "!attrs": {},
	
    "#if": {children: ["#if","#else", "#elseif"]},
	"#attempt": {children: ["#recover"]},		
	"#list": _break,
	"#switch": {children: [ "#case", "#default"]},
	"#function": _return,
	"#macro":{children:["#nested", "#return"]},	
	"#case": _break,
	"#setting":{
	attrs:{locale:null, number_format:["number","computer","currency","percent"],boolean_format:["true,false"],date_format:null, 
	time_format:null,datetime_format:null,time_zone:null,url_escaping_charset:null,classic_compatible:["true","false"]},
	children:[]
	},
	"#ftl":{
	attrs:{encoding:null, strip_whitespace:["true","false"],strip_text:["true","false"],strict_syntax:["true","false"],ns_prefixes:null,attributes:null},
	children:[]
	},
    "#else":empty, "#elseif":empty, "#recover":empty, "#assign":empty, "#import":empty, "#include":empty,"#break":empty,"#return":empty,
	"#default":empty, "#noparse":empty, "#compress":empty, "#global":empty, "#local":empty, "#flush":empty, "#stop":empty,"#t":empty,"#lt":empty,
	"#rt":empty, "#nt":empty,"#visit":empty, "#recurse":empty, "#fallback":empty
  };

 function completeAfter(cm, pred) {
    var cur = cm.getCursor();
    if (!pred || pred()) setTimeout(function() {
      if (!cm.state.completionActive)
        cm.showHint({completeSingle: false});
    }, 100);
    return CodeMirror.Pass;
  }

  function completeIfAfterLt(cm) {
    return completeAfter(cm, function() {
      var cur = cm.getCursor();
      return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
    });
  }

  function completeIfInTag(cm) {
    return completeAfter(cm, function() {
      var tok = cm.getTokenAt(cm.getCursor());
      if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
      var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
      return inner.tagName;
    });
  }

var enhanceComponentEditor = function(){
	var textarea = document.getElementById("lia-componentContent");
	if (textarea != null) {
		 getEditorOption("xml", 
			function(mode){
  				var editor = CodeMirror.fromTextArea(document.getElementById("lia-componentContent"),mode);
	  			$('.CodeMirror').resizable({
											resize: function() {
											editor.setSize($(this).width(), $(this).height());
											}
	   			});
          setFullScreenLink(editor);
    		});
    }
}


var enhancePageEditor = function(){ 
     $(".QuiltEditorTab").bind("LITHIUM:updateFormWatch", function(e){
       if ($(e.target).hasClass("admin-xml-tab")){
       	  getEditorOption("text/xml", function(mode){	
       	   var editor = CodeMirror.fromTextArea(document.getElementsByClassName("lia-quilt-editor-xml")[0], mode);
		   $('.CodeMirror').resizable({
		    							resize: function() {
															editor.setSize($(this).width(), $(this).height());
												}	
									});
       setFullScreenLink(editor);
		});
       }
  	 });
}

var enhanceLayoutEditor = function(){ 
   $.jQuery(".LayoutEditorTab").bind("LITHIUM:updateFormWatch", function(e){
       if ($.jQuery(e.target).hasClass("admin-xml-tab")){
       	  getEditorOption("text/xml", function(mode){
 			var editor = CodeMirror.fromTextArea(document.getElementsByClassName("lia-layout-editor-xml")[0], mode);
		   	$('.CodeMirror').resizable({
		    							resize: function() {
			           								editor.setSize($(this).width(), $(this).height());
								  		}
	   								});
      setFullScreenLink(editor);

       	  });
       }
  	 });
}

var enhanceWrapperEditor = function(){ 
    var liaHead = $("#lia-head");
	var liaHeader = $("#lia-header");
	var liaFooter = $("#lia-footer");
	var liaHitbox = $("#lia-hitbox");
	getEditorOption("text/html", function(defaultOptions){

		if (liaHead.attr("disabled") == undefined){
      		var editorHitbox = CodeMirror.fromTextArea(liaHitbox.get(0), defaultOptions);
      		var editorFooter = CodeMirror.fromTextArea(liaFooter.get(0), defaultOptions);
      		var editorHeader = CodeMirror.fromTextArea(liaHeader.get(0), defaultOptions);
      		var editorHead = CodeMirror.fromTextArea(liaHead.get(0),defaultOptions);
          setFullScreenLink(editorHitbox);
          setFullScreenLink(editorFooter);
          setFullScreenLink(editorHeader);
          setFullScreenLink(editorHead);

      		$('.CodeMirror').resizable({
        		resize: function() {
          					editorHead.setSize($(this).width(), $(this).height());
          					editorHeader.setSize($(this).width(), $(this).height());
          					editorFooter.setSize($(this).width(), $(this).height());
          					editorHitbox.setSize($(this).width(), $(this).height());			
      			}
	  		});
    	}
	});
}

var enhanceCssEditor = function() { 
     var textarea = $("#lia-skinCss");
     if (textarea.attr("disabled") == undefined){         
       getEditorOption("text/css", function(mode) {
       	var editor = CodeMirror.fromTextArea(textarea.get(0), mode);
	   	  $('.CodeMirror').resizable({
		 							resize: function() {
		   								editor.setSize($(this).width(), $(this).height());
	     							}
	   								});
      setFullScreenLink(editor);
       });	
     }
}


var enhanceEndpointEditor = function() {
    var textarea = document.getElementById("lia-content");
    if (textarea != null) {
    	getEditorOption("text/html", function(mode) {
    		var editor = CodeMirror.fromTextArea(document.getElementById("lia-content"), mode);
	  		$('.CodeMirror').resizable({
										resize: function() {
													editor.setSize($(this).width(), $(this).height());
										}
	   								});		
        setFullScreenLink(editor);
    	});
      
    }
}

var enhanceApiBrowser = function() {
	var textarea = document.getElementById("searchResults");
    if (textarea != null) {
      var options = getEditorOption("application/json", function(options){
      	options.autoCloseBrackets = true;
      	var editor = CodeMirror.fromTextArea(textarea, options);
	  	$('.CodeMirror').resizable({
			       resize: function() {
									editor.setSize($(this).width(), $(this).height());
							}
	   	});

      setFullScreenLink(editor);

      });
    }
}

var enhanceInitScript = function() {
	var textarea = document.getElementById("lia-commonInitContent");
    if (textarea != null) {
      var options = getEditorOption("text/html", function(options){
      	options.autoCloseBrackets = true;
      	var editor = CodeMirror.fromTextArea(textarea, options);
	  	$('.CodeMirror').resizable({
			resize: function() {
									editor.setSize($(this).width(), $(this).height());
								}
	   	 });	
      setFullScreenLink(editor);
      });
    }
}

var enableEnhancement = function() {
	$(".CodeMirror").remove(); //Replace any existing Codemirror instance
	var tab = getStudioTab();
	console.log("Current studio tab is " + tab);
	switch (tab) {
	  case "custom-content" :
	   enhanceComponentEditor();
	  break;
	  case "page-editor" :
	  case "studio" :
	   enhancePageEditor();
	   break;
	  case "layout-editor" :
	   enhanceLayoutEditor();
	   break;
	  case "wrapper" :
	   enhanceWrapperEditor();
	   break;
	  case "css" :
	   enhanceCssEditor();
	   break;
	  case "endpoints" :
	   enhanceEndpointEditor();
	   break;
	  case "api-browser" :
	    enhanceApiBrowser();
	    break;
	  case "init" :
	  	enhanceInitScript();
	  	break;
	}
}

//Refresh the editor after an option has been changed:
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request == "refresh"){
      enableEnhancement();
    }
  });

enableEnhancement();
console.log("Studio Enhance extension loaded");

var getStudioTab = function(){
  var url = document.location.href;

  var res = "";

  var urlTabs = url.split("/tab/");
  console.log("UrlTabs: " + urlTabs);

  if (urlTabs && urlTabs != null && urlTabs.length > 0){
     var res = urlTabs[urlTabs.length - 1].split("/")[0].split("?")[0];
     res = decodeURIComponent(res).split(":");
     res = res[res.length - 1];
  }

  return res;
}

var getEditorOption = function(mode){

	return {
         mode: mode,
         lineNumbers: true,
         lineWrapping: true,
         foldGutter: {
                        rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
         },
         gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
         matchTags: {bothTags: true},
         matchBrackets: true,
	     extraKeys: {
            "'<'": completeAfter,
            "'/'": completeIfAfterLt,
            "' '": completeIfInTag,
            "'='": completeIfInTag,
            "Ctrl-Space": "autocomplete"
         },
         hintOptions: {schemaInfo: tags}
    };
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
		var mode = getEditorOption("text/html");
  		var editor = CodeMirror.fromTextArea(document.getElementById("lia-componentContent"),mode);
	  		$('.CodeMirror').resizable({
				resize: function() {
				editor.setSize($(this).width(), $(this).height());
				}
	   		});
    	}
    }


var enhancePageEditor = function(){ 
     $(".QuiltEditorTab").bind("LITHIUM:updateFormWatch", function(e){
       if ($(e.target).hasClass("admin-xml-tab")){
       	   var editor = CodeMirror.fromTextArea(document.getElementsByClassName("lia-quilt-editor-xml")[0], getEditorOption("text/xml"));
		   $('.CodeMirror').resizable({
		    resize: function() {
			editor.setSize($(this).width(), $(this).height());
		}
	   });
       }
  	 });

}

var enhanceLayoutEditor = function(){ 
   $.jQuery(".LayoutEditorTab").bind("LITHIUM:updateFormWatch", function(e){
       if ($.jQuery(e.target).hasClass("admin-xml-tab")){
       	   var editor = CodeMirror.fromTextArea(document.getElementsByClassName("lia-layout-editor-xml")[0], getEditorOption("text/xml"));
		   $('.CodeMirror').resizable({
		    resize: function() {
			editor.setSize($(this).width(), $(this).height());
		}
	   });
       }
  	 });
}

var enhanceWrapperEditor = function(){ 
    var liaHead = $("#lia-head");
	var liaHeader = $("#lia-header");
	var liaFooter = $("#lia-footer");
	var liaHitbox = $("#lia-hitbox");
	var defaultOptions = getEditorOption("text/html");

	if (liaHead.attr("disabled") == undefined){
      var editorHitbox = CodeMirror.fromTextArea(liaHitbox.get(0), defaultOptions);
      var editorFooter = CodeMirror.fromTextArea(liaFooter.get(0), defaultOptions);
      var editorHeader = CodeMirror.fromTextArea(liaHeader.get(0), defaultOptions);
      var editorHead = CodeMirror.fromTextArea(liaHead.get(0),defaultOptions);
    
      $('.CodeMirror').resizable({
        resize: function() {
          editorHead.setSize($(this).width(), $(this).height());
          editorHeader.setSize($(this).width(), $(this).height());
          editorFooter.setSize($(this).width(), $(this).height());
          editorHitbox.setSize($(this).width(), $(this).height());			
      	}
	  });
    }
}

var enhanceCssEditor = function() { 
     var textarea = $("#lia-skinCss");
     if (textarea.attr("disabled") == undefined){         
       var editor = CodeMirror.fromTextArea(textarea.get(0), getEditorOption("text/css"));
	   $('.CodeMirror').resizable({
		 resize: function() {
		   editor.setSize($(this).width(), $(this).height());
	     }
	   });
     }
}


var enhanceEndpointEditor = function() {
    var textarea = document.getElementById("lia-content");
    if (textarea != null) {
      var editor = CodeMirror.fromTextArea(document.getElementById("lia-content"), getEditorOption("text/html"));
	  $('.CodeMirror').resizable({
		resize: function() {
			editor.setSize($(this).width(), $(this).height());
		}
	   });
    }
}

var enhanceApiBrowser = function() {
	$(".CodeMirror.cm-s-default").remove(); //Replace the default Code Mirror 
    var textarea = document.getElementById("searchResults");
    if (textarea != null) {
      var options = getEditorOption("application/json");
      options.autoCloseBrackets = true;
      var editor = CodeMirror.fromTextArea(textarea, options);
	  $('.CodeMirror').resizable({
		resize: function() {
			editor.setSize($(this).width(), $(this).height());
		}
	   });
    }
}

var tab = getStudioTab();
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
  case "community-style:wrapper" :
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
}

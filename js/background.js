	chrome.runtime.onInstalled.addListener(function() {
	  // Replace all rules ...
	  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
	    chrome.declarativeContent.onPageChanged.addRules([
	      {
	        conditions: [
	          new chrome.declarativeContent.PageStateMatcher({
	            pageUrl: { urlContains: '/t5/bizapps/bizappspage/tab/community%3Astudio' },
	          }),
	          new chrome.declarativeContent.PageStateMatcher({
	            pageUrl: { urlContains: '/t5/bizapps/page/tab/community%3Astudio' },
	          })
 	        ],
	        // And shows the extension's page action.
	        actions: [ new chrome.declarativeContent.ShowPageAction() ]
	      }
	    ]);
	  });
	});
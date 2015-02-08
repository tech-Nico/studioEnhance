	chrome.runtime.onInstalled.addListener(function() {
	  // Replace all rules ...
	  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
	    chrome.declarativeContent.onPageChanged.addRules([
	      {
	        // That fires when a page's URL contains a 'g' ...
	        conditions: [
	          new chrome.declarativeContent.PageStateMatcher({
	            pageUrl: { urlContains: '/t5/bizapps/bizappspage/tab/community%3Astudio%3A' },
	          })
	        ],
	        // And shows the extension's page action.
	        actions: [ new chrome.declarativeContent.ShowPageAction() ]
	      }
	    ]);
	  });
	});
// Saves options to chrome.storage
function save_options() {
  var syntaxHighlight = document.getElementById('syntaxHighlight').checked;
  var lineNumbers = document.getElementById('lineNumbers').checked;
  var wrapLines = document.getElementById('wrapLines').checked;
  var matchTag = document.getElementById('matchTag').checked;
  var matchBracket = document.getElementById('matchBracket').checked;
  var codeHint = document.getElementById('codeHint').checked;
  
  chrome.storage.sync.set({
    syntaxHighlight: syntaxHighlight,
    lineNumbers: lineNumbers,
    wrapLines : wrapLines,
    matchTag: matchTag,
    matchBracket : matchBracket,
    codeHint : codeHint
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  console.log("Called restore_options");
  //Use default values if the storage is empty. Enable everything
  chrome.storage.sync.get({
    syntaxHighlight: true,
    lineNumbers: true,
    wrapLines : true,
    matchTag: true,
    matchBracket : true,
    codeHint : true
  }, function(items) {
    document.getElementById('syntaxHighlight').checked = items.syntaxHighlight;
    document.getElementById('lineNumbers').checked = items.lineNumbers;
    document.getElementById('wrapLines').checked = items.wrapLines;
    document.getElementById('matchTag').checked = items.matchTag;
    document.getElementById('matchBracket').checked = items.matchBracket;
    document.getElementById('codeHint').checked = items.codeHint;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
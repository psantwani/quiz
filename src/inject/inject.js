chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "find_best_option") {
    let { q, qOptions } = request.payload;
    let result = {};
    qOptions.forEach(option => {
      var found = findString(option);
      if (found) {
        result[option] = 1;
      }
    });
    alert(result);

    sendResponse({ success: true });
  }
});

function findString(str) {
  if (parseInt(navigator.appVersion) < 4) return;
  var strFound;
  if (window.find) {
    // CODE FOR BROWSERS THAT SUPPORT window.find

    strFound = self.find(str);
    if (!strFound) {
      strFound = self.find(str, 0, 1);
      while (self.find(str, 0, 1)) continue;
    }
  } else if (navigator.appName.indexOf("Microsoft") != -1) {
    // EXPLORER-SPECIFIC CODE

    if (TRange != null) {
      TRange.collapse(false);
      strFound = TRange.findText(str);
      if (strFound) TRange.select();
    }
    if (TRange == null || strFound == 0) {
      TRange = self.document.body.createTextRange();
      strFound = TRange.findText(str);
      if (strFound) TRange.select();
    }
  } else if (navigator.appName == "Opera") {
    alert("Opera browsers not supported, sorry...");
    return;
  }
  if (strFound) {
    return true;
  }

  return false;
}

// https://www.google.co.in/search?game=quizmaster&q=hello&options=adele;tom hanks
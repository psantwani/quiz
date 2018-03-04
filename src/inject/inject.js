const commonWords = ["from", "in", "with", "is", "was", "will", "and", "or", "but", "nor", "so", "for", "yet", "after",
"although", "as", "because", "before", "once", "since", "though", "till", "unless", "until",
"what", "when", "while", "about", "to", "besides", "like", "between", "under", "after", "beyond", "of", "by",
"off", "until", "along", "despite", "on", "with", "at", "for", "in", "into", "a", "an", "the"];


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "find_best_option") {
    let { q, qOptions } = request.payload;
    let result = [];
    let body = document.getElementById("res").innerText.toLocaleLowerCase();
    qOptions.forEach(option => {
      option = option.toLocaleLowerCase();
      var found = findString(body, option);
      if (found) {
        // result[option] = found;
        result.push({
          option,
          count: found
        })
      }
    });

    if(result.length){
      result.sort((a, b) => {
        return parseInt(b.count) > parseInt(a.count);
      });
    }
    else{
      qOptions.forEach(option => {
        option = option.toLocaleLowerCase();
        var words = option.split(" ");
        for (let index = 0; index < words.length; index++) {
          const word = words[index];
          if(commonWords.indexOf(word) > -1){
            continue;
          }

          var found = findString(body, word);
          if (found) {
            result.push({
              option,
              word,
              count: found,
              type: "PARTIAL"
            })
          }
        }
      });

      if(result.length){
        result.sort((a, b) => {
          return parseInt(b.count) > parseInt(a.count);
        });
      }
    }

    alert(JSON.stringify(result, null, 4));
    
    /**
    let keys = Object.keys(result);
    if(keys.length > 1){
      keys.forEach(option => {
        var count = findString(option, true);
        result[option] = count;
      });

      alert(JSON.stringify(result, null, 4));
    }
    else{
      alert(JSON.stringify(result, null, 4));
    }
    **/

    sendResponse({ success: true });
  }
});

function findString(str, option){
  var regex = new RegExp(option, "g"), result, indices = [];
  while ( (result = regex.exec(str)) ) {
      indices.push(result.index);
  }
  return indices.length;
}

function findString2(str, getCount=false) {
  let count = 1;
  if (parseInt(navigator.appVersion) < 4) return;
  var strFound;
  if (window.find) {
    // CODE FOR BROWSERS THAT SUPPORT window.find
    if(getCount){
      while(self.find(str)){
        count++;
      }
      return count;
    }
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
// https://www.google.co.in/search?num=5&q=who+has+been+india%27s+longest-+serving+prime+minister&game=quizmaster&options=options=jawaharlal nehru;indira gandhi;manmohan singh
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  sendResponse();
});

chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status === "complete") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        const game = getParameterByName("game", url);
        if (game === "quizmaster") {
          const q = getParameterByName("q", url);
          const options = getParameterByName("options", url);
          callContentScript(q, options.split(";"));
        }
      }
    );
  }
});

function callContentScript(q, qOptions) {
  console.log("Q: ", q);
  console.log("Options: ", qOptions);
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        action: "find_best_option",
        payload: {
          q,
          qOptions
        }
      },
      function(response) {
        console.log(response);
      }
    );
  });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

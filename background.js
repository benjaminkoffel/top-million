const proxyScriptURL = "proxy.js";

browser.proxy.register(proxyScriptURL);

browser.proxy.onProxyError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

function httpRequest(method, url, timeout, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.timeout = timeout;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText);
    } else {
      callback(null);
    }
  };
  xhr.send();
}

function handleInit() {
  browser.storage.onChanged.addListener((settings) => {
    allowed = settings.top.newValue.concat(settings.whitelist.newValue);
    browser.runtime.sendMessage(allowed, {
      toProxyScript: true
    });
  });
  browser.storage.local.get()
    .then((settings) => {
      if (Object.keys(settings).length === 0 && settings.constructor === Object) {
        var url = browser.runtime.getURL("million.lst");
        httpRequest("GET", url, 10000, (response) => {
          if (response) {
            alert(response);
            defaultSettings = {
              top: response.split("\n"),
              whitelist: [
                "localhost",
                "google.com"
              ]
            }
            browser.storage.local.set(defaultSettings);
          } else {
            console.log("Error retrieving top sites");
          }
        });
      } else {
        allowed = settings.top.concat(settings.whitelist);
        browser.runtime.sendMessage(allowed, {
          toProxyScript: true
        });
      }
    })
    .catch(() => {
      console.log("Error retrieving stored settings");
    });
}

function handleMessage(message, sender) {
  if (sender.url != browser.extension.getURL(proxyScriptURL)) {
    return;
  }
  if (message === "init") {
    handleInit(message);
  } else {
    console.log(message);
  }
}

browser.runtime.onMessage.addListener(handleMessage);
const proxyScriptURL = "proxy.js";

browser.proxy.register(proxyScriptURL);

browser.proxy.onProxyError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

function getTopSites(callback) {
  url = browser.runtime.getURL("million.lst");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.timeout = 10000;
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(xhr.responseText.split("\n"));
    } else {
      callback(null);
    }
  };
  xhr.send();
}

function handleInit() {
  getTopSites((sites) => {
    if (sites) {
      browser.storage.onChanged.addListener((settings) => {
        allowed = sites.concat(settings.whitelist.newValue);
        browser.runtime.sendMessage(allowed, {
          toProxyScript: true
        });
      });
      browser.storage.local.get()
        .then((settings) => {
          if (Object.keys(settings).length === 0 && settings.constructor === Object) {
            browser.storage.local.set({
              whitelist: [".localhost"]
            });
          } else {
            allowed = sites.concat(settings.whitelist);
            browser.runtime.sendMessage(allowed, {
              toProxyScript: true
            });
          }
        })
        .catch(() => {
          console.log("Error retrieving stored settings.");
        });
    } else {
      console.log("Error retrieving top sites.");
    }
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
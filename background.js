const proxyScriptURL = "proxy.js";

const defaultSettings = {
  whitelist: [
    "example.com"
  ]
}

browser.proxy.register(proxyScriptURL);

browser.proxy.onProxyError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

function handleInit() {
  browser.storage.onChanged.addListener((newSettings) => {
    browser.runtime.sendMessage(newSettings.whitelist.newValue, {
      toProxyScript: true
    });
  });
  browser.storage.local.get()
    .then((storedSettings) => {
      if (storedSettings.whitelist) {
        browser.runtime.sendMessage(storedSettings.whitelist, {
          toProxyScript: true
        });
      } else {
        browser.storage.local.set(defaultSettings);
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

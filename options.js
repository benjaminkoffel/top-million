const textArea = document.querySelector("#whitelist");

function onError(e) {
  console.error(e);
}

function storeSettings() {
  settings = browser.storage.local.get()
    .then((settings) => {
      settings.whitelist = textArea.value.split("\n");
      browser.storage.local.set(settings);
    }, onError)
}

browser.storage.local.get().then((settings) => {
  textArea.value = settings.whitelist.join("\n");
}, onError);

textArea.addEventListener("change", storeSettings);
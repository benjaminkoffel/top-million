const textArea = document.querySelector("#whitelist");

function storeSettings() {
  let whitelist = textArea.value.split("\n");
  browser.storage.local.set({
    whitelist
  });
}

function updateUI(restoredSettings) {
  textArea.value = restoredSettings.whitelist.join("\n");
}

function onError(e) {
  console.error(e);
}

browser.storage.local.get().then(updateUI, onError);

textArea.addEventListener("change", storeSettings);

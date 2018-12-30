const textArea = document.querySelector("#whitelist");

function storeSettings() {
  browser.storage.local.set({
    whitelist: textArea.value.split("\n")
  });
}

browser.storage.local.get().then((settings) => {
  textArea.value = settings.whitelist.join("\n");
}, (e) => console.error(e));

textArea.addEventListener("change", storeSettings);
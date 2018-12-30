var allowed = [];

browser.runtime.sendMessage("init");

browser.runtime.onMessage.addListener((message) => {
  allowed = message;
  browser.runtime.sendMessage("recvd" + message);
});

function FindProxyForURL(url, host) {
  for (var i = 0; i < allowed.length; ++i) {
    if (host.split(":")[0].endsWith(allowed[i])) {
      return "DIRECT";
    }
  }
  browser.runtime.sendMessage(`BLOCKED URL: ${url}`);
  return "PROXY 127.0.0.1:65535";
}
function TrieNode(key) {
  this.key = key;
  this.children = {};
  this.end = false;
}

function Trie() {
  this.root = new TrieNode(null);
}

Trie.prototype.insert = function(word) {
  var node = this.root;
  for (var i = word.length - 1; i >= 0; i--) {
    if (!node.children[word[i]]) {
      node.children[word[i]] = new TrieNode(word[i]);
    }
    node = node.children[word[i]];
    if (i == word.length-1) {
      node.end = true;
    }
  }
};

Trie.prototype.contains = function(word) {
  var node = this.root;
  for (var i = word.length - 1; i >= 0; i--) {
    if (node.end) {
      return true;
    }
    if (node.children[word[i]]) {
      node = node.children[word[i]];
    } else {
      return false;
    }
  }
  return node.end;
};

var trie = new Trie();

browser.runtime.sendMessage("init");

browser.runtime.onMessage.addListener((message) => {
  trie = new Trie();
  for (var i = 0; i < message.length; ++i) {
    trie.insert(message[i]);
  }
  browser.runtime.sendMessage("recvd" + message);
});

function FindProxyForURL(url, host) {
  if (trie.contains("." + host)) {
    return "DIRECT";
  }
  browser.runtime.sendMessage(`BLOCKED URL: ${url}`);
  return "PROXY 127.0.0.1:65535";
}
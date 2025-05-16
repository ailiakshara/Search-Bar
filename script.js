class TNode {
  constructor() {
    this.isEOW = false;
    this.children = new Array(26).fill(null);
  }
}

class Trie {
  constructor() {
    this.root = new TNode();
  }

  insertWord(word) {
    let node = this.root;
    for (let ch of word.toLowerCase()) {
      if (ch >= "a" && ch <= "z") {
        let index = ch.charCodeAt(0) - "a".charCodeAt(0);
        if (node.children[index] === null) {
          node.children[index] = new TNode();
        }
        node = node.children[index];
      }
    }
    node.isEOW = true;
  }

  getAllWordsWithPrefix(prefix, limit = 10) {
    let node = this.root;
    let result = [];

    for (let ch of prefix.toLowerCase()) {
      let index = ch.charCodeAt(0) - "a".charCodeAt(0);
      if (node.children[index] === null) return result;
      node = node.children[index];
    }

    this._getAllWords(node, prefix, result, limit);
    return result;
  }

  _getAllWords(node, prefix, result, limit) {
    if (result.length >= limit) return;

    if (node.isEOW) {
      result.push(prefix);
    }

    for (let i = 0; i < 26 && result.length < limit; i++) {
      if (node.children[i] !== null) {
        let ch = String.fromCharCode(i + "a".charCodeAt(0));
        this._getAllWords(node.children[i], prefix + ch, result, limit);
      }
    }
  }
}

const trie = new Trie();

async function loadDictionary() {
  try {
    const response = await fetch("dictionary.txt");
    if (!response.ok) throw new Error("Failed to load dictionary");
    const text = await response.text();
    const words = text
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word);

    words.forEach((word) => trie.insertWord(word));
    console.log("Dictionary loaded:", words);
  } catch (error) {
    console.error("Error loading dictionary:", error);
  }
}

function handleSearch() {
  const input = document.getElementById("searchInput").value;
  const results = trie.getAllWordsWithPrefix(input, 10); // Limit to top 10
  displayResults(results);
}

function displayResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  results.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    resultsContainer.appendChild(li);
  });
}

// Load dictionary when page loads
window.onload = () => {
  loadDictionary();
};

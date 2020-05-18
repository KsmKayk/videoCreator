const algorithmia = require("algorithmia");
const apiKey = require("../credentials/algorithmia.json");

function robot(content) {
  fetchContentFromWikipedia(content);
  // sanitizeContent(content)
  // breakContentIntoSetences(content)

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(apiKey.apiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = wikipediaResponse.get();
    console.log(wikipediaContent);
  }
}

module.exports = robot;

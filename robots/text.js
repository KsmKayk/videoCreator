const algorithmia = require("algorithmia");
const apiKey = require("../credentials/algorithmia.json");

async function robot(content) {
  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  // breakContentIntoSetences(content)

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(apiKey.apiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
  }

  function sanitizeContent(content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(
      content.sourceContentOriginal
    );
    const withoutDatesInParentheses = removeDatesInParetheses(
      withoutBlankLinesAndMarkdown
    );

    console.log(withoutDatesInParentheses);

    function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split("\n");
      console.log(allLines);

      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith("=")) {
          return false;
        }

        return true;
      });

      return withoutBlankLinesAndMarkdown.join(" ");
    }
  }

  function removeDatesInParetheses(text) {
    return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, "").replace(/  /g, " ");
  }
}

module.exports = robot;

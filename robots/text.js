const algorithmia = require("algorithmia");
const algorithmiaApiKey = require("../credentials/algorithmia.json");
const sentenceBoundaryDetection = require("sbd");

const watsonApiKey = require("../credentials/ibm.json").apikey
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js')
const { IamAuthenticator } = require('ibm-watson/auth');

let nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})

const state = require("./state")

async function robot() {
  console.log(`> [Text-Robot] Iniciando`)
  const content = state.load()

  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSetences(content);
  limitMaximumSentences(content);
  await fetchKeywordsOfAllSentences(content);
  
  state.save(content)

  async function fetchContentFromWikipedia(content) {
    console.log(`> [Text-Robot] Pegando conteudo da Wikipedia`)
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey.apiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm);
    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
    console.log(`> [Text-Robot] Pego!`)
  }

  function sanitizeContent(content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(
      content.sourceContentOriginal
    );
    const withoutDatesInParentheses = removeDatesInParetheses(
      withoutBlankLinesAndMarkdown
    );

    content.sourceContentSanitized = withoutDatesInParentheses;

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

  function breakContentIntoSetences(content) {
    content.sentences = [];

    const sentences = sentenceBoundaryDetection.sentences(
      content.sourceContentSanitized
    );
    sentences.forEach((sentence) => {
      content.sentences.push({
        text: sentence,
        keywords: [],
        images: [],
      });
    });
  }

  function limitMaximumSentences(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences)
  }

  async function fetchKeywordsOfAllSentences(content) {
    console.log(`> [Text-Robot] Pegando palavras-chaves das frases com Watson`)
    for ( const sentence of content.sentences) {
      console.log(`> [Text-Robot] Frase: "${sentence.text}"`)
     sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
      console.log(`> [Text-Robot] Palavras-Chaves: ${sentence.keywords.join(", ")}\n`)
   }
  }

  async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
      nlu.analyze({
        text: sentence,
        features: {
          keywords: {}
        }
      }, (error, response) => {
        if(error) {
          reject(error)
          return
         }
  
  
        const keywords = response.result.keywords.map((keyword) => {
          return keyword.text
         })
         resolve(keywords)
      }) 
    })
  }

}

module.exports = robot;

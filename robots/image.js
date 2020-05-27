const state =  require("./state")
const google = require("googleapis").google
const customSearch = google.customsearch("v1")

const googleSearchCredentials = require("../credentials/googleSearch.json")

async function robot() {
  const content = state.load()

  await fetchImagesOfAllSentences(content)

  state.save(content)

  async function fetchImagesOfAllSentences(content) {
    for(const sentence of content.sentences) {
      const query = `${content.searchTerm.articleName} ${sentence.keywords[0]}`
      sentence.images = await fetchGoogleAndReturnImagesLink(query)

      sentence.googleSearchQuery = query
    }
  }

  async function fetchGoogleAndReturnImagesLink(query) {
    const response = await customSearch.cse.list({
      auth: googleSearchCredentials.apiKey,
      cx: googleSearchCredentials.searchEngineId,
      q: query,
      searchType: "Image",
      num: 2
    })

    const imagesUrl = response.data.items.map((item) => {
      return item.link
    })

    return imagesUrl
  }
}

module.exports = robot
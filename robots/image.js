const imgUrlBlackList = require('../content/blacklistimg.json').imageUrlBlackList
const imageDownloader = require("image-downloader")
const gm = require("gm").subClass({imageMagick: true})
const state =  require("./state")
const google = require("googleapis").google
const customSearch = google.customsearch("v1")

const googleSearchCredentials = require("../credentials/googleSearch.json")

async function robot() {
  const content = state.load()

  //await fetchImagesOfAllSentences(content)

  //await downloadAllImages(content)
  
  await convertAllImages(content)

  //state.save(content)

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
      num: 5
    })

    const imagesUrl = response.data.items.map((item) => {
      return item.link
    })

    return imagesUrl
  }

  async function downloadAllImages(content) {
    content.downloadedImages = []

    for(let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      const images = content.sentences[sentenceIndex].images

      for(let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex]

        try {
          if(content.downloadedImages.includes(imageUrl)) {
            throw new Error("Imagem ja foi baixada")
          }
          if (imgUrlBlackList.includes(imageUrl)){
            throw new Error('Imagem em black list')
            }
          await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
          content.downloadedImages.push(imageUrl)
          console.log(`>[${sentenceIndex}][${imageIndex}] Baixou com sucesso: ${imageUrl}`)
          break
        } catch(error) {
          console.log(`>[${sentenceIndex}][${imageIndex}] Erro ao baixar: (${imageUrl}): ${error}`)
        }
      }
    }
  }

  async function downloadAndSave(url, fileName) {
    return imageDownloader.image({
      url, url,
      dest: `./content/${fileName}`
    })
  }

  async function convertAllImages(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      await convertImage(sentenceIndex)
    }
  }
  async function convertImage(sentenceIndex) {
    return new Promise((resolve, reject) => {
      const inputFile = `./content/${sentenceIndex}-original.png[0]`
      const outputFile = `./content/${sentenceIndex}-converted.png`
      const width = 1920
      const height = 1080

      gm(`content/${sentenceIndex}-original.png[0]`)
        .in()
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-blur', '0x9')
          .out('-resize', `${width}x${height}^`)
        .out(')')
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-resize', `${width}x${height}`)
        .out(')')
        .out('-delete', '0')
        .out('-gravity', 'center')
        .out('-compose', 'over')
        .out('-composite')
        .out('-extent', `${width}x${height}`)
        .write(`content/${sentenceIndex}-converted.png`, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> Image converted: ${inputFile}`)
          resolve()
        })

    })
  }

}

module.exports = robot
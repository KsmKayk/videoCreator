const imgUrlBlackList = require('../content/blacklistimg.json').imageUrlBlackList
const imageDownloader = require("image-downloader")
const gm = require("gm").subClass({imageMagick: true})
const state =  require("./state")
const google = require("googleapis").google
const customSearch = google.customsearch("v1")

const googleSearchCredentials = require("../credentials/googleSearch.json")

async function robot() {
  console.log(`> [Image-Robot] Iniciando`)
  const content = state.load()

  await fetchImagesOfAllSentences(content)
  await downloadAllImages(content)
  
  state.save(content)

  async function fetchImagesOfAllSentences(content) {
    for(let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      let query
      let thumb 

      if (sentenceIndex === 0) {
        query = `${content.searchTerm.articleName}`
        thumb = true
      } else {
        query = `${content.searchTerm.articleName} ${content.sentences[sentenceIndex].keywords[0]}`
        thumb = false
      }
      
      console.log(`> [Image-Robot] Procurando imagens no google com: "${query}"`)
      content.sentences[sentenceIndex].images = await fetchGoogleAndReturnImagesLink(query, thumb)
      content.sentences[sentenceIndex].googleSearchQuery = query
    }
  }

  async function fetchGoogleAndReturnImagesLink(query, thumb) {
    if (thumb) {
      const response = await customSearch.cse.list({
        auth: googleSearchCredentials.apiKey,
        cx: googleSearchCredentials.searchEngineId,
        q: query,
        searchType: "Image",
        imgSize:"huge",
        num: 5
      })
  
      const imagesUrl = response.data.items.map((item) => {
        return item.link
      })
      return imagesUrl
    } else {
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

    
  }

  async function downloadAllImages(content) {
    content.downloadedImages = []

    for(let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      const images = content.sentences[sentenceIndex].images

      for(let imageIndex = 0; imageIndex < images.length; imageIndex++) {
        const imageUrl = images[imageIndex]

        try {
          if(content.downloadedImages.includes(imageUrl)) {
            throw new Error("> [Image-Robot]Imagem ja foi baixada")
          }
          if (imgUrlBlackList.includes(imageUrl)){
            throw new Error('> [Image-Robot] Imagem em black list')
            }
          await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
          content.downloadedImages.push(imageUrl)
          console.log(`> [Image-Robot] [${sentenceIndex}][${imageIndex}] Baixou com sucesso: ${imageUrl}`)
          break
        } catch(error) {
          console.log(`> [Image-Robot] [${sentenceIndex}][${imageIndex}] Erro ao baixar: (${imageUrl}): ${error}`)
        }
      }
    }
  }

  async function downloadAndSave(url, fileName) {
    return imageDownloader.image({
      url: url,
      dest: `./content/${fileName}`
    })
  }

  

}

module.exports = robot
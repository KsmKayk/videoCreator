const gm = require("gm").subClass({imageMagick: true})
const state =  require("./state")
const spawn = require("child_process").spawn
const path = require("path")
const rootPath = path.resolve(__dirname, "..")

async function robot() {
  console.log(`> [Video-Robot] Iniciando`)
  const content = state.load()

  await convertAllImages(content)
  await createAllSentenceImages(content)
  await createYouTubeThumbnail()
  await createAfterEffectsScript(content)
  await renderVideoWithAfterEffects()

  state.save(content)

  async function convertAllImages(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      await convertImage(sentenceIndex)
    }
  }
  async function convertImage(sentenceIndex) {
    return new Promise((resolve, reject) => {
      const inputFile = `./content/${sentenceIndex}-original.png`
      const outputFile = `./content/${sentenceIndex}-converted.png`
      const width = 1920
      const height = 1080
      console.log(inputFile, outputFile)

      try {
        gm()
        .command("magick")
        .in(inputFile)
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
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

         console.log(`> [Video-Robot] Imagem convertida: ${outputFile}`)
         resolve()
        })
      } catch (error) {
        reject(error)
      }
      

    })
  }

  async function createAllSentenceImages(content) {
    for(let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++){
      await createSentenceImage(sentenceIndex, content.sentences[sentenceIndex].text) 
    }
  }

  async function createSentenceImage(sentenceIndex, sentenceText) {
    return new Promise((resolve, reject) => {
      const outputFile = `./content/${sentenceIndex}-sentence.png`
      const templateSettings = {
        0: {
          size: '1920x400',
          gravity: 'center'
        },
        1: {
          size: '1920x1080',
          gravity: 'center'
        },
        2: {
          size: '800x1080',
          gravity: 'west'
        },
        3: {
          size: '1920x400',
          gravity: 'center'
        },
        4: {
          size: '1920x1080',
          gravity: 'center'
        },
        5: {
          size: '800x1080',
          gravity: 'west'
        },
        6: {
          size: '1920x400',
          gravity: 'center'
        }

      }

      gm()
        .command("magick")
        .out('-size', templateSettings[sentenceIndex].size)
        .out('-gravity', templateSettings[sentenceIndex].gravity)
        .out('-background', 'transparent')
        .out('-fill', 'white')
        .out('-kerning', '-1')
        .out(`caption:${sentenceText}`)
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> [Video-Robot] Frase criada: ${outputFile}`)
          resolve()
        })
    })
  }

  async function createYouTubeThumbnail() {
    return new Promise((resolve, reject) => {
      gm()
        .command("magick")
        .in('./content/0-converted.png')
        .write('./content/youtube-thumbnail.jpg', (error) => {
          if (error) {
            return reject(error)
          }

          console.log('> [Video-Robot] Criando thumbnail!')
          resolve()
        })
    })
  }

  async function createAfterEffectsScript(content) {
    state.saveScript(content)
  }

  async function renderVideoWithAfterEffects() {
    return new Promise((resolve, reject) => {
      const aerenderFilePath = "D:/APPS/ADOBE/Adobe After Effects 2020/Support Files/aerender.exe"
      const templateFilePath = `${rootPath}/templates/1/template.aep`
      const destinationFilePath = `${rootPath}/content/output.mov`

      console.log("> [Video-Robot] Iniciando After Effects")

      const aerender = spawn(aerenderFilePath, [
        `-comp`, `main`,
        `-project`, templateFilePath,
        `-output`, destinationFilePath
      ])
      aerender.stdout.on("data", (data) => {
        process.stdout.write(data)
      })
      aerender.on("close", () => {
        console.log(`> [Video-Robot] After Effects Fechado`)
        resolve()
      })
    })
  }
}

module.exports = robot
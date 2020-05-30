const state = require("./state")
const express = require("express")
const google = require("googleapis").google
const youtube = google.youtube({ version:"v3"})
const OAuth2 = google.auth.OAuth2
const fs = require("fs")

async function robot() {
  console.log(`> [Youtube-Robot] Iniciando`)
  const content = state.load()

  await authenticationWithOAuth()
  const videoInformation = await uploadVideo(content)
  await uploadThumbnail(videoInformation)

  async function authenticationWithOAuth() {
    const webServer = await startWebServer() 
    const OAuthClient = await createOAuthClient()
    requestUserConsent(OAuthClient)
    const authorizationToken = await waitForGoogleCallback(webServer)
    await requestGoogleForAcessTokens(OAuthClient, authorizationToken)
    setGlobalGoogleAuthentication(OAuthClient)
    await stopWebServer(webServer)

    async function startWebServer() {
      return new Promise((resolve, reject)=> {
        const port = 5000
        const app = express() 

        const server = app.listen(port, () => {
          console.log(`> [Youtube-Robot] Aberto em: http://localhost:${port}`)

          resolve({
            app,
            server
          })
        })
      })
    }

    async function createOAuthClient() {
      const credentials = require("../credentials/googleYoutube.json")
      const OAuth2Client = new OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
      )
      return OAuth2Client
    }

    function requestUserConsent(OAuth2Client) {
      const consentUrl = OAuthClient.generateAuthUrl({
        access_type:"offline",
        scope:"https://www.googleapis.com/auth/youtube"
      })

      console.log(`> [Youtube-Robot] Por favor me dê sua autorização: ${consentUrl}`)
    }

    async function waitForGoogleCallback(webServer) {
      return new Promise((resolve, reject) => {
        console.log(`> [Youtube-Robot] Esperando autorização`)

        webServer.app.get(`/oauth2callback`,(req, res) => {
          const authCode = req.query.code
          console.log(`> Autorização dada: ${authCode}`)

          res.send("<h1>Obrigado!</h1><p>Agora feche essa aba.<p>")
          resolve(authCode)
        }) 
      })
    }

    async function requestGoogleForAcessTokens(OAuthClient, authorizationToken) {
      return new Promise((resolve, reject) => {
        OAuthClient.getToken(authorizationToken,(error, tokens) => {
          if (error) {
            return reject(error)
          }

          console.log(`> [Youtube-Robot] Token de acesso recebido:`)
          console.log(tokens)

          OAuthClient.setCredentials(tokens)
          resolve()
        })
      })
    }

    function setGlobalGoogleAuthentication(OAuthClient) {
      google.options({
        auth: OAuthClient
      })
    }

    async function stopWebServer(webServer) {
      return new Promise((resolve, reject) => {
        webServer.server.close(() => {
          resolve()
        })
      })
    }
  }

  async function uploadVideo(content) {
    const videoFilePath = "./content/output.mov"
    const videoFileSize = fs.statSync(videoFilePath).size
    const videoTitle = `${content.prefix} ${content.searchTerm.articleName}`
    const videoTags = [content.searchTerm.articleName, ...content.sentences[0].keywords]
    const videoDescription = content.sentences.map((sentence) => {
      return sentence.text
    }).join("\n\n")

    const requestParameters = {
      part: "snippet, status",
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDescription,
          tags: videoTags,
        },
        status: {
          privacyStatus: "public"
        }
      },
      media: {
        body: fs.createReadStream(videoFilePath)
      }
    }

    const youtubeResponse = await youtube.videos.insert(requestParameters, {
      onUploadProgress: onUploadProgress
    })

    console.log(`> [Youtube-Robot]Video em: https://youtu.be/${youtubeResponse.data.id}`)

    return youtubeResponse.data

    function onUploadProgress(event) {
      const progress = Math.round((event.bytesRead / videoFileSize) * 100 )
      console.log(`> [Youtube-Robot] ${progress}% completo`)
    }
  }

  async function uploadThumbnail(videoInformation) {
    const videoId = videoInformation.id
    const videoThumbnailFilePath = "./content/youtube-thumbnail.jpg"

    const requrestParameters = {
      videoId: videoId,
      media: {
        mimeType: "image/jpeg",
        body: fs.createReadStream(videoThumbnailFilePath)
      }
    }

    const youtubeResponse = await youtube.thumbnails.set(requrestParameters)
    console.log(`> [Youtube-Robot] Thumbnail Enviada!`)
  }

}

module.exports = robot
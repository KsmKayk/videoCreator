const { app, BrowserWindow } = require('electron')

function createWindow() {

  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('views/main.html')

}
app.on("ready", createWindow)
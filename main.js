const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')

const isDev = !app.isPackaged
const windowStateFile = path.join(app.getPath('userData'), 'window-state.json')

let mainWindow

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function sendStatus(text) {
  if (mainWindow) mainWindow.webContents.send('update-status', text)
}

function loadWindowState() {
  try {
    return JSON.parse(fs.readFileSync(windowStateFile, 'utf8'))
  } catch {
    return null
  }
}

function saveWindowState() {
  if (!mainWindow) return
  const bounds = mainWindow.getBounds()
  const maximized = mainWindow.isMaximized()
  fs.writeFileSync(windowStateFile, JSON.stringify({ ...bounds, maximized }))
}

function createWindow() {
  const state = loadWindowState()
  const opts = {
    width: state?.width || 1200,
    height: state?.height || 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'app', 'logo.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  }
  if (state?.x != null && state?.y != null) {
    opts.x = state.x
    opts.y = state.y
  }

  mainWindow = new BrowserWindow(opts)
  if (state?.maximized) mainWindow.maximize()

  Menu.setApplicationMenu(null)
  mainWindow.loadFile(path.join(__dirname, 'app', 'index.html'))

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      ::-webkit-scrollbar { display: none; }
      * { scrollbar-width: none; }
    `)
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return { action: 'allow' }
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Copiar', role: 'copy' },
    { label: 'Pegar', role: 'paste' },
    { label: 'Cortar', role: 'cut' },
    { type: 'separator' },
    { label: 'Seleccionar todo', role: 'selectAll' },
  ])
  mainWindow.webContents.on('context-menu', () => {
    contextMenu.popup()
  })

  mainWindow.on('close', saveWindowState)
  mainWindow.on('resize', saveWindowState)
  mainWindow.on('move', saveWindowState)
}

autoUpdater.on('checking-for-update', () => sendStatus('checking'))

autoUpdater.on('update-available', (info) => {
  sendStatus('available')
  mainWindow.webContents.send('update-info', info)
})

autoUpdater.on('update-not-available', () => sendStatus('not-available'))

autoUpdater.on('download-progress', (progress) => {
  mainWindow.webContents.send('download-progress', progress)
})

autoUpdater.on('update-downloaded', () => sendStatus('downloaded'))

autoUpdater.on('error', (err) => {
  mainWindow.webContents.send('update-error', err.message)
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    createWindow()

    if (!isDev) {
      setTimeout(() => autoUpdater.checkForUpdates(), 3000)
    }

    ipcMain.on('check-update', () => {
      autoUpdater.checkForUpdates()
    })

    ipcMain.on('download-update', () => {
      autoUpdater.downloadUpdate()
    })

    ipcMain.on('install-update', () => {
      autoUpdater.quitAndInstall()
    })

    ipcMain.on('get-version', (event) => {
      event.returnValue = app.getVersion()
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
}

app.on('window-all-closed', () => {
  app.quit()
})

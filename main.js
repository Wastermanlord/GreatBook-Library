const { app, BrowserWindow, Menu, ipcMain, session, Tray, nativeImage } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const fs = require('fs')

const isDev = !app.isPackaged
const userData = app.getPath('userData')
const windowStateFile = path.join(userData, 'window-state.json')
const contentDir = path.join(userData, 'content')

let mainWindow
let contentRoot = path.join(__dirname, 'app')

function contentPath(file) {
  const local = path.join(contentDir, file)
  if (fs.existsSync(local)) return local
  return path.join(contentRoot, file)
}

async function updateContent() {
  const RAW = 'https://raw.githubusercontent.com/Wastermanlord/GreatBook-Library/main'
  try {
    const res = await fetch(RAW + '/content-version.json')
    if (!res.ok) return false
    const remote = await res.json()
    const verFile = path.join(contentDir, 'version.json')
    let current = ''
    try { current = JSON.parse(fs.readFileSync(verFile, 'utf8')).version } catch {}
    if (current === remote.version) return false
    fs.rmSync(contentDir, { recursive: true, force: true })
    const files = remote.files
    let ok = true
    for (const f of files) {
      try {
        const fres = await fetch(RAW + '/app/' + encodeURI(f))
        if (!fres.ok) { ok = false; break }
        const buf = Buffer.from(await fres.arrayBuffer())
        const dest = path.join(contentDir, f)
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.writeFileSync(dest, buf)
      } catch { ok = false; break }
    }
    if (!ok) { fs.rmSync(contentDir, { recursive: true, force: true }); return false }
    fs.writeFileSync(verFile, JSON.stringify(remote))
    contentRoot = contentDir
    return files.length
  } catch { return false }
}

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

let tray

function createTray() {
  const iconPath = path.join(__dirname, 'app', 'logo.png')
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })
  tray = new Tray(icon)
  tray.setToolTip('GreatBook Library')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Abrir', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus() } } },
    { type: 'separator' },
    { label: 'Salir', click: () => { app.isQuitting = true; app.quit() } },
  ]))
  tray.on('double-click', () => { if (mainWindow) { mainWindow.show(); mainWindow.focus() } })
}

function setCSP() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
          "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
          "img-src 'self' data:; " +
          "connect-src 'self' https://api.github.com https://github.com; " +
          "frame-src 'none'; object-src 'none'"
        ],
      },
    })
  })
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
  mainWindow.loadFile(contentPath('index.html'))

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

  if (!isDev) {
    mainWindow.on('close', (e) => {
      if (!app.isQuitting) {
        e.preventDefault()
        mainWindow.hide()
      }
    })
  } else {
    mainWindow.on('close', saveWindowState)
  }
  mainWindow.on('resize', saveWindowState)
  mainWindow.on('move', saveWindowState)
}

app.on('before-quit', () => { app.isQuitting = true })

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
      if (!mainWindow.isVisible()) mainWindow.show()
      mainWindow.focus()
    }
  })

  app.whenReady().then(async () => {
    setCSP()
    createWindow()
    if (!isDev) createTray()

    if (!isDev) {
      setTimeout(() => autoUpdater.checkForUpdates(), 3000)
    }

    if (!isDev) {
      const updated = await updateContent()
      if (updated) mainWindow.loadFile(contentPath('index.html'))
      if (mainWindow) mainWindow.webContents.send('content-version', { updated: !!updated })
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

    ipcMain.on('get-content-root', (event) => {
      event.returnValue = contentRoot
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

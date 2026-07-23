const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  getVersion: () => ipcRenderer.sendSync('get-version'),
  checkUpdate: () => ipcRenderer.send('check-update'),
  downloadUpdate: () => ipcRenderer.send('download-update'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onUpdateStatus: (cb) => {
    ipcRenderer.on('update-status', (_event, status) => cb(status))
  },
  onUpdateInfo: (cb) => {
    ipcRenderer.on('update-info', (_event, info) => cb(info))
  },
  onDownloadProgress: (cb) => {
    ipcRenderer.on('download-progress', (_event, progress) => cb(progress))
  },
  onUpdateError: (cb) => {
    ipcRenderer.on('update-error', (_event, msg) => cb(msg))
  },
})

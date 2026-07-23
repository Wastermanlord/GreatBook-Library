const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  getVersion: () => ipcRenderer.sendSync('get-version'),
  checkUpdate: () => ipcRenderer.send('check-update'),
  downloadUpdate: () => ipcRenderer.send('download-update'),
  installUpdate: () => ipcRenderer.send('install-update'),
  onUpdateStatus: (cb) => {
    ipcRenderer.removeAllListeners('update-status')
    ipcRenderer.on('update-status', (_event, status) => cb(status))
  },
  onUpdateInfo: (cb) => {
    ipcRenderer.removeAllListeners('update-info')
    ipcRenderer.on('update-info', (_event, info) => cb(info))
  },
  onDownloadProgress: (cb) => {
    ipcRenderer.removeAllListeners('download-progress')
    ipcRenderer.on('download-progress', (_event, progress) => cb(progress))
  },
  onUpdateError: (cb) => {
    ipcRenderer.removeAllListeners('update-error')
    ipcRenderer.on('update-error', (_event, msg) => cb(msg))
  },
})

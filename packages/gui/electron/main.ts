import fsp from 'node:fs/promises'
import path from 'node:path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { UsageMap } from '@record-your-life/shared'

const STORAGE_PATH = 'E:\\program\\record-your-life'
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })
  win.webContents.openDevTools()
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  const DATE_JSON_REGX = /\d{4}-\d{2}-\d{2}.json/
  ipcMain.handle('all-date', async () => {
    const dates = (await fsp.readdir(STORAGE_PATH))
      .filter((item) => DATE_JSON_REGX.test(item))
      .map((item) => item.replace('.json', ''))
    return dates
  })

  ipcMain.handle('app', async (_e, date: string) => {
    try {
      const content = await fsp.readFile(
        path.join(STORAGE_PATH, date + '.json'),
        'utf-8',
      )
      const raw: UsageMap = JSON.parse(content)
      const result = []
      for (const [name, value] of Object.entries(raw)) {
        result.push({
          name,
          ...value,
        })
      }

      return result.sort((a, b) => b.total - a.total)
    } catch (err) {
      return
    }
  })
  createWindow()
})

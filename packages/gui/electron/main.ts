import fsp from 'node:fs/promises'
import path from 'node:path'
import { app, BrowserWindow, ipcMain, Menu, utilityProcess } from 'electron'
import { UsageMap } from '@record-your-life/shared'
import {
  setupTitlebar,
  attachTitlebarToWindow,
} from 'custom-electron-titlebar/main'

setupTitlebar()
const STORAGE_PATH = 'E:\\program\\record-your-life'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    titleBarStyle: 'hidden',
    width: 900,
    height: 550,
    titleBarOverlay: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  Menu.setApplicationMenu(null)
  attachTitlebarToWindow(win)
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

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
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
        try {
          if (value.path && value.total > 0 && value.durations.length > 2) {
            const icon = await app.getFileIcon(value.path, {
              size: 'large',
            })
            result.push({
              name,
              ...value,
              icon: icon.toDataURL(),
            })
          }
        } catch (error) {}
      }

      return result.sort((a, b) => b.total - a.total)
    } catch (err) {
      return
    }
  })
  createWindow()
  utilityProcess.fork(path.join(__dirname, './watch.mjs'))
})

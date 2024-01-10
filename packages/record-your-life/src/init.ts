import path from 'node:path'
import fsp from 'node:fs/promises'
import fs from 'node:fs'
import { WatchWindowForeground, getMainWindow } from 'hmc-win32'
import { Config, Usage, getYMD } from '@record-your-life/shared'
import { __dirname } from './constant'
import { findApp, getInstalledApps } from './utils'

const records: Map<string, Usage> = new Map()

function insertRecord(name: string | undefined, onlyInit = false) {
  if (!name) {
    return
  }
  name = name.replace('.exe', '')
  const record = records.get(name)
  const now = Date.now()
  if (!record || onlyInit) {
    records.set(name, {
      total: 0,
      end: now,
      start: now,
      durations: [],
    })
  } else {
    record.durations.push({ time: now, duration: record.total })
    record.total += now - record.end
    record.end = now
  }
}

export async function init(timer: number, config: Config) {
  const todayFile = path.join(config.storagePath, `${getYMD()}.json`)
  if (fs.existsSync(todayFile)) {
    try {
      const content: Record<string, Usage> = JSON.parse(
        await fsp.readFile(todayFile, 'utf-8'),
      )

      if (content) {
        for (const [key, value] of Object.entries(content)) {
          records.set(key, value)
        }
      }
    } catch (error) {}
  }
  let shoudWrite = false
  let count = 0
  const apps = await getInstalledApps()
  WatchWindowForeground(async (_curr, prevId, win) => {
    const preApp = findApp(apps, getMainWindow(prevId)?.pid)
    const curApp = findApp(apps, win.pid)
    if (curApp) {
      const record = records.get(curApp)
      if (!record) {
        insertRecord(curApp, true)
      } else {
        record.end = Date.now()
      }
    }
    insertRecord(preApp)
    shoudWrite = true
  })
  setInterval(async () => {
    count++
    if (shoudWrite || count > 6) {
      await fsp.writeFile(
        todayFile,
        JSON.stringify(Object.fromEntries(records)),
      )
      shoudWrite = false
      count > 6 && count === 0
    }
  }, timer)
}

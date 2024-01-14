import path from 'node:path'
import fsp from 'node:fs/promises'
import fs from 'node:fs'
import { Config, Usage, getYMD } from '@record-your-life/shared'
import { getCachedApps } from 'win-active-app-rs'
import { __dirname } from './constant'
import { findApp, watchForegroundWindow } from './utils'

const records: Map<string, Usage> = new Map()

function updateRecord(name: string | undefined, onlyInit = false) {
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
  const apps = getCachedApps()
  console.log(apps)
  let preApp: string | undefined
  watchForegroundWindow(async (p) => {
    const curApp = findApp(apps, p)
    if (curApp) {
      const record = records.get(curApp)
      if (!record) {
        updateRecord(curApp, true)
      } else {
        record.end = Date.now()
      }
    }
    updateRecord(preApp)
    preApp = curApp
  })
  setInterval(async () => {
    await fsp.writeFile(todayFile, JSON.stringify(Object.fromEntries(records)))
  }, timer)
}

import path from 'node:path'
import fsp from 'node:fs/promises'
import fs from 'node:fs'
import { activeWindow } from '@miniben90/x-win'

// FIXME: replace with `reocrd-your-life/utils`
// This file run at child process as we use nodejs native binding
// Js file can not import ts file
const STORAGE_PATH = './storage'
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH)
}
export function pad(n) {
  return String(n).padStart(2, '0')
}
export function getYMD() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export async function init(timer) {
  const records = new Map()
  function updateRecord(name, path, partDuration, onlyInit = false) {
    const { memory, url, title } = partDuration
    if (!name || !path || !memory || !title || url == null) {
      return
    }
    const record = records.get(name)
    const now = Date.now()
    if (!record || onlyInit) {
      records.set(name, {
        total: 0,
        path,
        end: now,
        start: now,
        durations: [],
      })
    } else {
      record.durations.push({
        time: now,
        duration: record.total,
        memory,
        url,
        title,
      })
      record.total += now - record.end
      record.end = now
    }
  }
  const todayFile = path.join(STORAGE_PATH, `${getYMD()}.json`)
  if (fs.existsSync(todayFile)) {
    try {
      const content = JSON.parse(await fsp.readFile(todayFile, 'utf-8'))

      if (content) {
        for (const [key, value] of Object.entries(content)) {
          records.set(key, value)
        }
      }
    } catch (error) {}
  }
  let preApp
  watchForegroundWindow(async (curApp) => {
    if (
      curApp &&
      !curApp.info.path.toLocaleLowerCase().startsWith('c:\\windows')
    ) {
      const record = records.get(curApp.info.name)
      if (!record) {
        updateRecord(
          curApp.info.name,
          curApp.info.path,
          {
            memory: curApp.usage.memory,
            url: curApp.url,
            title: curApp.title,
          },
          true,
        )
      } else {
        record.end = Date.now()
      }
      if (preApp) {
        const { info, usage, url, title } = preApp
        updateRecord(info.name, info.path, {
          memory: usage.memory,
          url,
          title,
        })
      }
      preApp = curApp
    }
  })
  setInterval(async () => {
    await fsp.writeFile(todayFile, JSON.stringify(Object.fromEntries(records)))
  }, timer)
}

async function sleep() {
  return new Promise((r) => setTimeout(r, 350))
}

export async function watchForegroundWindow(cb) {
  let oldInfo = activeWindow()
  while (true) {
    const newInfo = activeWindow()
    console.log({ newInfo })
    if (newInfo && newInfo.info.path !== oldInfo.info.path) {
      cb(newInfo)
      oldInfo = newInfo
    }
    await sleep()
  }
}

init(1000)

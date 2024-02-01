import path from 'node:path'
import fsp from 'node:fs/promises'
import fs, { readFileSync } from 'node:fs'
import { WindowInfo, activeWindow } from '@miniben90/x-win'
import color from 'picocolors'
import { Config, Duration, Usage, getYMD } from '@record-your-life/shared'
import { __dirname, CONFIG_FILE_PATH } from './constant'

export function initConfig(): Config {
  try {
    const config = JSON.parse(readFileSync(CONFIG_FILE_PATH, 'utf-8'))
    return config
  } catch (error) {
    return {
      storagePath: './',
    }
  }
}

type R = {
  path?: string
  start: number
  total: number
  end: number
  durations: Pick<Duration, 'time' | 'duration'>[]
}

export async function init(timer: number, config: Config) {
  const records: Map<string, R> = new Map()
  function updateRecord(name: string | undefined, onlyInit = false) {
    if (!name) {
      return
    }
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
      record.durations.push({
        time: now,
        duration: record.total,
      })
      record.total += now - record.end
      record.end = now
    }
  }
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
  let preApp: WindowInfo | undefined
  watchForegroundWindow(async (curApp) => {
    if (
      curApp &&
      !curApp.info.path.toLocaleLowerCase().startsWith('c:\\windows')
    ) {
      const record = records.get(curApp.info.name)
      if (!record) {
        updateRecord(curApp.info.name, true)
      } else {
        record.end = Date.now()
      }
      if (preApp) {
        updateRecord(preApp.info.name)
      }
      preApp = curApp
    }
  })
  setInterval(async () => {
    await fsp.writeFile(todayFile, JSON.stringify(Object.fromEntries(records)))
  }, timer)
}

export const highlight = (str: string | number) =>
  // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
  color.underline(color.white(str))

export function getUtf8Length(str: string) {
  let count = 0
  for (let i = 0; i < str.length; i++) {
    count += Math.ceil(str[i].charCodeAt(0).toString(2).length / 8)
  }
  return count
}

async function sleep() {
  return new Promise((r) => setTimeout(r, 350))
}

export async function watchForegroundWindow(cb: (info: WindowInfo) => void) {
  let oldInfo = activeWindow()
  while (true) {
    const newInfo = activeWindow()
    if (newInfo && newInfo.info.path !== oldInfo.info.path) {
      cb(newInfo)
      oldInfo = newInfo
    }
    await sleep()
  }
}

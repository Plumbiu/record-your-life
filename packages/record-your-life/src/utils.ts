import path from 'node:path'
import fsp from 'node:fs/promises'
import fs, { readFileSync } from 'node:fs'
import { WindowInfo, activeWindow } from '@miniben90/x-win'
import color from 'picocolors'
import { Config, Usage, getYMD, pad } from '@record-your-life/shared'
import { __dirname, CONFIG_FILE_PATH } from './constant'

const records: Map<string, Usage> = new Map()

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
    }
    updateRecord(preApp?.info.name)
    preApp = curApp
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
  let oldpath = activeWindow()
  while (true) {
    const newPath = activeWindow()
    if (newPath && newPath.info.path !== oldpath.info.path) {
      cb(newPath)
      oldpath = newPath
    }
    await sleep()
  }
}

export function backDate(date: string, step: number) {
  if (step >= 0) {
    return date
  }
  const nums = date.split('-').map((item) => Number(item))
  const stepDay = nums[2] + step
  if (stepDay > 0) {
    nums[2] = stepDay
  } else {
    const month = nums[1] - 1
    if (month > 0) {
      const daysNum = monthDayNum(+nums[0])
      nums[1] = month
      nums[2] = daysNum[month - 1]
    } else {
      nums[0] = nums[0] - 1
      nums[1] = 12
      nums[2] = 31
    }
  }

  return `${nums[0]}-${pad(nums[1])}-${pad(nums[2])}`
}

export function monthDayNum(year: number) {
  const normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year % 4 === 0) {
    normal[1]++
  }
  return normal
}

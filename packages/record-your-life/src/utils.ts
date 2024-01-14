import path from 'node:path'
import { getCurrentAppPath } from 'win-active-app-rs'
import color from 'picocolors'
import { App } from '@record-your-life/shared'

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
export function findApp(apps: App, p: string) {
  const app = apps?.[p]
  if (!app) {
    const exe = path.basename(p).replace('.exe', '')
    return Object.values(apps).find((name) => {
      const loName = name.toLocaleLowerCase()
      return loName.includes(exe) || exe.includes(loName)
    })
  }
  return app
}

async function sleep() {
  return new Promise((r) => setTimeout(r, 350))
}

export async function watchForegroundWindow(cb: (exePath: string) => void) {
  let oldpath = getCurrentAppPath()
  while (true) {
    const newPath = getCurrentAppPath()
    console.log(newPath)

    if (newPath && newPath !== oldpath) {
      if (cb) {
        cb(newPath)
        oldpath = newPath
      }
    }
    await sleep()
  }
}

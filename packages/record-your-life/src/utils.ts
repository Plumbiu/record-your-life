import color from 'picocolors'
import { WindowInfo, activeWindow } from '@miniben90/x-win'

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

import { spawn } from 'node:child_process'
import { getProcessFilePath2Sync, getProcessName2Sync } from 'hmc-win32'
import { App } from '@record-your-life/shared'
import color from 'picocolors'

const textDecoder = new TextDecoder('gbk')

export function getInstalledApps() {
  return new Promise<App>((r) => {
    const sp = spawn('REG', [
      'QUERY',
      // eslint-disable-next-line @stylistic/max-len
      'HKEY_CLASSES_ROOT\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\MuiCache',
    ])
    let data = ''
    sp.stdout.on('data', (chunk) => {
      data += textDecoder.decode(chunk)
    })
    sp.stdout.on('end', () => {
      const result: App = {}
      const arr = data.split(/\r?\n|\s{2,}/g).filter(Boolean)
      let i = 0
      while (i < arr.length) {
        if (arr[i].endsWith('.FriendlyAppName')) {
          const key = arr[i].replace('.FriendlyAppName', '')
          const value: string[] = []
          i++
          while (
            !arr[i].endsWith('.ApplicationCompany') &&
            !arr[i].endsWith('.FriendlyAppName')
          ) {
            if (arr[i] !== 'REG_SZ') {
              value.push(arr[i])
            }
            i++
          }
          result[key.toLocaleLowerCase()] = value.join(' ')
        }
        i++
      }
      r(result)
    })
  })
}

const EXCLUDES_EXE = ['searchhost', 'explorer', '[system process]']
export function findApp(apps: App, pid: number | null | undefined) {
  if (pid == null) {
    return
  }
  const filePath = getProcessFilePath2Sync(pid)?.toLocaleLowerCase()
  if (filePath == null) {
    return
  }
  if (!apps[filePath]) {
    const exe = getProcessName2Sync(pid)?.replace('.exe', '').toLowerCase()
    if (exe) {
      if (EXCLUDES_EXE.includes(exe)) {
        return
      }
      const id = Object.values(apps).find(
        (app) =>
          // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
          app.toLowerCase().includes(exe) || exe?.includes(app.toLowerCase()),
      )
      return id
    }
  }
  return apps[filePath]
}

export const highlight = (str: string | number) =>
  // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
  color.underline(color.white(str))

export function getUtf8Length(str: string) {
  let count = 0
  Object.values(str).forEach((item) => {
    count += Math.ceil(item.charCodeAt(0).toString(2).length / 8)
  })
  return count
}

import { spawn } from 'node:child_process'
import { getProcessFilePath2Sync } from 'hmc-win32'
import { App } from '@record-your-life/shared'
import coniv from 'iconv-lite'

export function getInstalledApps() {
  return new Promise<App>((r) => {
    const sp = spawn('REG', [
      'QUERY',
      // eslint-disable-next-line @stylistic/max-len
      'HKEY_CLASSES_ROOT\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\MuiCache',
    ])
    let data = ''
    sp.stdout.on('data', (chunk) => {
      data += coniv.decode(chunk, 'cp936')
    })
    sp.stdout.on('end', () => {
      const result: App = {}
      const arr = data.split(/\r?\n|\s{2,}/g).filter(Boolean)
      let i = 0
      while (i < arr.length) {
        if (arr[i].endsWith('.exe.FriendlyAppName')) {
          const key = arr[i].replace('.FriendlyAppName', '')
          const value: string[] = []
          while (!arr[++i].endsWith('.exe.ApplicationCompany')) {
            if (arr[i] !== 'REG_SZ') {
              value.push(arr[i])
            }
          }
          result[key] = value.join(' ')
        }
        i++
      }
      r(result)
    })
  })
}

export function findApp(apps: App, pid: number | null) {
  if (pid === null) {
    return
  }
  const filePath = getProcessFilePath2Sync(pid)
  if (filePath === null) {
    return
  }
  return apps[filePath]
}

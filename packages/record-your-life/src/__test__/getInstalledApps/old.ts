import { spawn } from 'node:child_process'
import { App } from '@record-your-life/shared'
import { listRegistrPath } from 'hmc-win32'

const textDecoder = new TextDecoder('utf8')

export function getInstalledApps_REG() {
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

const EXE_SUFFIX = '.FriendlyAppName'
export function getInstalledApps_HMC() {
  const apps = listRegistrPath(
    'HKEY_CLASSES_ROOT',
    // eslint-disable-next-line @stylistic/max-len
    'Local Settings\\Software\\Microsoft\\Windows\\Shell\\MuiCache',
  )
  const formatApps: Record<string, string> = {}
  for (const [key, value] of Object.entries(apps)) {
    if (key.endsWith(`.exe${EXE_SUFFIX}`)) {
      formatApps[key.replace(EXE_SUFFIX, '').toLocaleLowerCase()] =
        value.toString()
    }
  }
  return formatApps
}

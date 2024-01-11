import {
  getProcessFilePath2Sync,
  getProcessName2Sync,
  listRegistrPath,
} from 'hmc-win32'
import { App } from '@record-your-life/shared'
import color from 'picocolors'

const EXE_SUFFIX = '.FriendlyAppName'
export function getInstalledApps() {
  const apps = listRegistrPath(
    'HKEY_CLASSES_ROOT',
    // eslint-disable-next-line @stylistic/max-len
    'Local Settings\\Software\\Microsoft\\Windows\\Shell\\MuiCache',
  )
  const formatApps: Record<string, string> = {}
  for (const [key, value] of Object.entries(apps)) {
    if (key.endsWith(`.exe${EXE_SUFFIX}`)) {
      formatApps[key.replace(EXE_SUFFIX, ' ').toLocaleLowerCase()] =
        value.toString()
    }
  }
  return formatApps
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
  const app = apps[filePath]
  if (!app) {
    const exe = getProcessName2Sync(pid)?.replace('.exe', '').toLowerCase()
    if (exe) {
      if (EXCLUDES_EXE.includes(exe)) {
        return
      }
      const id = Object.values(apps).find(
        (item) =>
          // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
          item.toLowerCase().includes(exe) || exe?.includes(item.toLowerCase()),
      )
      return id
    }
  }
  return app
}

export const highlight = (str: string | number) =>
  // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
  color.underline(color.white(str))

export function getUtf8Length(str: string) {
  let count = 0
  for (let i = 0; i < str.length; i++) {
    count += str[i].charCodeAt(0).toString(2).length / 8
  }
  return count
}

import { App } from '@record-your-life/shared'
import { getProcessFilePath2Sync, getProcessName2Sync } from 'hmc-win32'

const EXCLUDES_EXE = ['searchhost', 'explorer', '[system process]']
const EXCLURES_APP = ['Windows 资源管理器']
export function findApp_HMC(apps: App, pid: number | null | undefined) {
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
  if (EXCLURES_APP.includes(app)) {
    return
  }
  return app
}

import { bench } from 'vitest'
import { getCachedApps } from 'win-active-app-rs'
import { findApp } from '../../utils'
import { findApp_HMC } from './old'

bench('findApp - HMC', async () => {
  const apps = getCachedApps()
  findApp_HMC(apps, 80)
})

bench('findApp - win-active-app-rs', () => {
  const apps = getCachedApps()
  findApp(apps, 'd:\\env\\git\\git-bash.exe')
})

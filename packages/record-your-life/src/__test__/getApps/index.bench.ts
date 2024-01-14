import { bench } from 'vitest'
import { getCachedApps } from 'win-active-app-rs'
import { findApp } from '../../utils'
import { findApp_HMC } from './old'

const apps = getCachedApps()
bench(
  'findApp - HMC',
  async () => {
    findApp_HMC(apps, 2170)
  },
  { time: 2000 },
)

bench(
  'findApp - win-active-app-rs',
  () => {
    findApp(apps, 'd:\\env\\git\\git-bash.exe')
  },
  { time: 2000 },
)

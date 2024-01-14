import { bench } from 'vitest'
import { getCachedApps } from 'win-active-app-rs'
import { getInstalledApps_REG, getInstalledApps_HMC } from './old'

// Too slow, skip it
bench.skip('getInstalledApps - reg', async () => {
  await getInstalledApps_REG()
})

bench('getInstalledApps - hmc', () => {
  getInstalledApps_HMC()
})

bench('getInstalledApps - win-active-app-rs', () => {
  getCachedApps()
})

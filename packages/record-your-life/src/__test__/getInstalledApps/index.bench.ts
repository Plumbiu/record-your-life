import { bench } from 'vitest'
import { getInstalledApps as getNew } from '../../utils'
import { getInstalledApps as getOld } from './old'

bench('getInstalledApps - old', async () => {
  await getOld()
})

bench('getInstalledApps - new', async () => {
  getNew()
})

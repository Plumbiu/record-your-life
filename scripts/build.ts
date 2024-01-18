/* eslint-disable @stylistic/max-len */
import { exec, execSync } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { RECORD_YOUR_LIFE_DIST } from './constant'

const stdout = execSync('pnpm -F record-your-life run build', {
  encoding: 'utf-8',
})
console.log(stdout)

async function initConfig() {
  try {
    await writeFile(
      path.join(RECORD_YOUR_LIFE_DIST, 'record-your-life.json'),
      JSON.stringify({
        storagePath: './',
      }),
    )
  } catch (error) {}
}

Promise.all([
  initConfig(),
  exec('pnpm -F web run build', (err, stdout) => {
    console.log(stdout)
  }),
])

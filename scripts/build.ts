/* eslint-disable @stylistic/max-len */
import { execSync } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { build } from 'vite'
import { RECORD_YOUR_LIFE_DIST, __dirname } from './constant'

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

async function webBuild() {
  await build({
    root: path.join(__dirname, '../packages/web'),
  })
}

Promise.all([initConfig(), webBuild()])

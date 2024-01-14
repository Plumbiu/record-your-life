/* eslint-disable @stylistic/max-len */
import { exec, execSync } from 'node:child_process'
import { copyFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const stdout = execSync('pnpm -F record-your-life run build', {
  encoding: 'utf-8',
})
console.log(stdout)
const RECORD_YOUR_LIFE = './packages/record-your-life/'
const DIST = path.join(RECORD_YOUR_LIFE, 'dist')

async function initConfig() {
  try {
    await writeFile(
      path.join(DIST, 'record-your-life.json'),
      JSON.stringify({
        storagePath: './',
      }),
    )
  } catch (error) {}
}

async function copyBindingNode() {
  try {
    const packagePath = path.join(
      RECORD_YOUR_LIFE,
      'node_modules',
      'win-active-app-rs',
    )
    const nodes = [
      'win-active-app-rs.win32-arm64-msvc.node',
      'win-active-app-rs.win32-ia32-msvc.node',
      'win-active-app-rs.win32-x64-msvc.node',
    ]
    for (const node of nodes) {
      console.log('copy ' + node)
      await copyFile(path.join(packagePath, node), path.join(DIST, node))
    }
  } catch (error) {}
}

Promise.all([
  initConfig(),
  copyBindingNode(),
  exec('pnpm -F web run build', (err, stdout) => {
    console.log(stdout)
  }),
])

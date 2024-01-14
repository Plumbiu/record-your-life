/* eslint-disable @stylistic/max-len */
import { exec, execSync } from 'node:child_process'
import { writeFile, copyFile } from 'node:fs/promises'
import path from 'node:path'

execSync('pnpm -F record-your-life run build')

async function initConfig() {
  try {
    await writeFile(
      './packages/record-your-life/dist/record-your-life.json',
      JSON.stringify({
        storagePath: './',
      }),
    )
    const nodes = [
      'win-active-app-rs.win32-arm64-msvc.node',
      'win-active-app-rs.win32-ia32-msvc.node',
      'win-active-app-rs.win32-x64-msvc.node',
    ]
    const nodePath = './packages/record-your-life/src/third_party'
    for (const node of nodes) {
      const p = path.join(nodePath, node)
      await copyFile(p, `./packages/record-your-life/dist/${node}`)
    }
  } catch (error) {}
}

Promise.all([initConfig(), exec('pnpm -F web run build')])

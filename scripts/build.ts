/* eslint-disable @stylistic/max-len */
import { exec, execSync } from 'node:child_process'
import { copyFile, readdir, writeFile } from 'node:fs/promises'
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
    const miniBenPath = path.join(
      RECORD_YOUR_LIFE,
      'node_modules',
      '@miniben90',
    )
    const nodes = await readdir(miniBenPath)
    await Promise.all(
      nodes.map(async (node) => {
        if (node.startsWith('x-win-')) {
          const nodeName = `x-win.${node.replace('x-win-', '')}.node`
          const nodePath = path.join(miniBenPath, node, nodeName)
          console.log(nodePath)

          await copyFile(nodePath, path.join(DIST, nodeName))
        }
      }),
    )
  } catch (error) {}
}

Promise.all([
  initConfig(),
  // copyBindingNode(),
  exec('pnpm -F web run build', (err, stdout) => {
    console.log(stdout)
  }),
])

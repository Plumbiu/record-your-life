import { exec, execSync } from 'node:child_process'
import { writeFile, mkdir } from 'node:fs/promises'

execSync('pnpm -F record-your-life run build')

async function initConfig() {
  try {
    await writeFile(
      './packages/record-your-life/dist/record-your-life.json',
      JSON.stringify({
        storagePath: './storage',
      }),
    )
    await mkdir('./packages/record-your-life/dist/storage')
  } catch (error) {}
}

Promise.all([initConfig(), exec('pnpm -F web run build')])

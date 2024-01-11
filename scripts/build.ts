import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

execSync('pnpm -F record-your-life run build')

try {
  writeFileSync(
    './packages/record-your-life/dist/record-your-life.json',
    JSON.stringify({
      storagePath: './storage',
    }),
  )
  mkdirSync('./packages/record-your-life/dist/storage')
} catch (error: any) {
  console.log(error.message)
}

execSync('pnpm -F web run build')

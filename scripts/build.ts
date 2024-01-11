import { exec } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

exec('pnpm -F record-your-life run build && pnpm -F web run build', (err) => {
  if (err) {
    console.log('error!')
  } else {
    writeFileSync(
      './packages/record-your-life/dist/record-your-life.json',
      JSON.stringify({
        storagePath: './storage',
      }),
    )
    mkdirSync('./packages/record-your-life/dist/storage')
  }
})

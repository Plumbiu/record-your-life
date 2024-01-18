import { exec } from 'node:child_process'
import path from 'node:path'
import { RECORD_YOUR_LIFE } from './constant'

const args = ['--list', '--table', '--bar', '--board']
const cmd = `esno ${path.join(
  RECORD_YOUR_LIFE,
  'src',
  'index.ts',
)} --file-name ./scripts/data-log.json `

args.map(async (arg) => {
  exec(cmd + arg, (err, data) => {
    if (err) {
      throw new Error(`arg - ${arg}\n error message:\n ${err.message}`)
    }
    console.log(data)
  })
})

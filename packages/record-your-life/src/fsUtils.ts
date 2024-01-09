import fs from 'node:fs'
import { Config } from '@record-your-life/shared'
import { CONFIG_FILE_PATH, DEFAULT_STORAGE_PATH } from './constant'

export function configInit() {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    fs.writeFileSync(
      CONFIG_FILE_PATH,
      JSON.stringify({
        storagePath: DEFAULT_STORAGE_PATH,
      }),
    )
  }
  if (!fs.existsSync(DEFAULT_STORAGE_PATH)) {
    fs.mkdirSync(DEFAULT_STORAGE_PATH, { recursive: true })
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')) as Config
}

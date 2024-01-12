import { readFileSync } from 'node:fs'
import { Config } from '@record-your-life/shared'
import { CONFIG_FILE_PATH } from './constant'

export function initConfig() {
  const config = JSON.parse(readFileSync(CONFIG_FILE_PATH, 'utf-8'))
  return config as Config
}

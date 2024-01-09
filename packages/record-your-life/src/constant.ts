import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export const CONFIG_FILE_PATH = path.join(__dirname, 'record-your-life.json')
export const DEFAULT_STORAGE_PATH = path.join(__dirname, 'storage')

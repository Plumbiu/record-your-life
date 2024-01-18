import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export const RECORD_YOUR_LIFE = './packages/record-your-life/'
export const RECORD_YOUR_LIFE_DIST = path.join(RECORD_YOUR_LIFE, 'dist')

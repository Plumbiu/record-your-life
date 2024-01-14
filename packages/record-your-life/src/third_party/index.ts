import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

switch (platform) {
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'win-active-app-rs.win32-x64-msvc.node'),
        )
        try {
          nativeBinding = require('./win-active-app-rs.win32-x64-msvc.node')
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'win-active-app-rs.win32-ia32-msvc.node'),
        )
        try {
          nativeBinding = require('./win-active-app-rs.win32-ia32-msvc.node')
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'win-active-app-rs.win32-arm64-msvc.node'),
        )
        try {
          nativeBinding = require('./win-active-app-rs.win32-arm64-msvc.node')
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error('Failed to load native binding')
}

const { getCurrentAppPath, getCachedApps } = nativeBinding

export { getCurrentAppPath, getCachedApps }

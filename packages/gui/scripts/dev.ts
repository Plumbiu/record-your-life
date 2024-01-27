import { fileURLToPath } from 'node:url'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'
import { build, startup } from 'vite-plugin-electron'

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function run() {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: path.join(__dirname, '../vite.config.ts'),
    root: path.join(__dirname, '../'),
    server: {
      port: 1337,
    },
  })
  await server.listen()
  server.printUrls()
  server.bindCLIShortcuts({ print: true })
  await fsp.copyFile(
    path.join(__dirname, '../electron/watch.mjs'),
    path.join(__dirname, '../dist-electron/watch.mjs'),
  )
  build({
    entry: 'electron/main.ts',
    vite: {
      mode: process.env.NODE_ENV,
      build: {
        minify: isProd,
        watch: isDev ? {} : null,
      },
      plugins: [
        {
          name: 'plugin-start-electron',
          closeBundle() {
            if (isDev) {
              // Startup Electron App
              startup()
            }
          },
        },
      ],
    },
  })
}
run()

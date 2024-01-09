import fsp from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { Config, Usage } from '@record-your-life/shared'
import chalk from 'chalk'
import { __dirname } from './constant'

export async function startServer(
  config: Config,
  records: Record<string, Usage>,
) {
  const html = await fsp.readFile(path.join(__dirname, '../dist', 'index.html'))
  const server = createServer((req, res) => {
    if (req.url === '/') {
      res.end(html)
    } else if (req.url === '/api/data') {
      res.end(JSON.stringify(records))
    }
  })
  server.listen(3033, () => {
    console.log('server is running at ' + chalk.cyan('http://localhost:3033'))
  })
}

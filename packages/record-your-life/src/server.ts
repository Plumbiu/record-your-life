import fsp from 'node:fs/promises'
import path from 'node:path'
import { Config, UsageMap } from '@record-your-life/shared'
import color from 'picocolors'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { __dirname } from './constant'

const fastify = Fastify()
fastify.register(cors, {
  origin: '*',
})

const DATE_JSON_REGX = /\d{4}-\d{2}-\d{2}.json/

export async function startServer(config: Config) {
  const { storagePath } = config
  let dates: string[] | undefined
  const html = await fsp.readFile(path.join(__dirname, '../dist', 'index.html'))
  fastify.get('/', (req, res) => {
    res.send(html)
  })

  fastify.get('/api/date', async (req, res) => {
    dates = (await fsp.readdir(storagePath)).filter((item) =>
      DATE_JSON_REGX.test(item),
    )
    res.send(dates)
  })

  fastify.get<{
    Querystring: {
      name: string
    }
  }>('/api/date/:date', async (req, res) => {
    const { date } = req.params as any
    const content = await fsp.readFile(path.join(storagePath, date + '.json'))
    res.send(content)
  })

  fastify.get('/api/app/:date', async (req, res) => {
    const { date } = req.params as any
    const content = await fsp.readFile(
      path.join(storagePath, date + '.json'),
      'utf-8',
    )
    const result: UsageMap = JSON.parse(content)
    const obj: string[] = []
    for (const [key, { total }] of Object.entries(result)) {
      if (total) {
        obj.push(key)
      }
    }
    res.send(obj)
  })

  fastify.listen({ port: 3033 }, () => {
    console.log('server is running at ' + color.cyan('http://localhost:3033'))
  })
}

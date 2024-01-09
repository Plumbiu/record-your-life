import path from 'node:path'
import fsp from 'node:fs/promises'
import { cac } from 'cac'
import { consola } from 'consola'
import { Config, Usage } from '@record-your-life/shared'
import { CONFIG_FILE_PATH, DEFAULT_STORAGE_PATH, __dirname } from './constant'
import { init } from './init'
import { Logger } from './logger'
import { startServer } from './server'
import { configInit } from './fsUtils'

const config: Config = configInit()
const cli = cac('record-your-life')

cli.command('set <storagePath>').action(async (storagePath) => {
  const writePath =
    storagePath === '__dirname' ? DEFAULT_STORAGE_PATH : storagePath
  try {
    await fsp.writeFile(
      CONFIG_FILE_PATH,
      JSON.stringify({ storagePath: writePath }),
    )
  } catch (error: any) {
    consola.error(error.message)
  }
})

cli
  .command('<date>')
  .option('--table', 'Table format of usage')
  .option('--bar', 'Bar chat format of usage')
  .option('--board', 'Board chat format of usage')
  .option('--web', 'Start web server')
  .option('--list', 'List of apps')
  .action(async (date: string, { table, list, bar, web, board }) => {
    try {
      const records: Record<string, Usage> = JSON.parse(
        await fsp.readFile(
          path.join(config.storagePath, `${date}.json`),
          'utf-8',
        ),
      )
      const logger = new Logger(records, date)
      if (table) {
        logger.table()
      } else if (list) {
        logger.list()
      } else if (bar) {
        logger.bar()
      } else if (web) {
        await startServer(config, records)
      } else {
        logger.board()
      }
      console.log()
    } catch (error: any) {
      consola.error(error.message)
    }
  })

cli.command('init [timer]', 'init record your life').action(async (timer) => {
  if (timer < 1000) {
    return
  }
  await init(timer ?? 1_000, config) // 5 min = 5 * 60 * 1000
})

cli.help()
cli.parse()

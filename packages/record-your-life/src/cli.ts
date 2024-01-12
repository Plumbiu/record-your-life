import path from 'node:path'
import fsp from 'node:fs/promises'
import { cac } from 'cac'
import { Usage, getYMD } from '@record-your-life/shared'
import color from 'picocolors'
import { CONFIG_FILE_PATH, __dirname } from './constant'
import { init } from './init'
import { Logger, logError } from './logger'
import { startServer } from './server'
import { highlight } from './utils'
import { initConfig } from './fsUtils'

const config = initConfig()
const cli = cac('record-your-life')

cli.command('set <storagePath>').action(async (storagePath) => {
  try {
    await fsp.writeFile(CONFIG_FILE_PATH, JSON.stringify({ storagePath }))
  } catch (error: any) {
    logError(error.message)
  }
})

cli
  .command('[date]')
  .option('--table', 'Table format of usage')
  .option('--bar', 'Bar chat format of usage')
  .option('--board', 'Board chat format of usage')
  .option('--web', 'Start web server')
  .option('--list', 'List of apps')
  .option('--detail', 'Show the unused apps')
  .action(async (date: string, { table, list, bar, web, board, detail }) => {
    try {
      if (!date) {
        date = getYMD()
        console.log(date)
      }
      const content = await fsp.readFile(
        path.join(config.storagePath, `${date}.json`),
        'utf-8',
      )
      if (!content) {
        throw new Error('empty data, please wait 5 min as least')
      }
      const records: Record<string, Usage> = JSON.parse(content)
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
      const unusedApps: string[] = logger.unusedApps

      if (unusedApps.length > 0 && detail) {
        console.log(
          '\n' +
            highlight(unusedApps.length) +
            color.dim(' unused apps') +
            color.white('(0ms)  '),
        )
        for (const app of unusedApps) {
          console.log(color.cyan(app))
        }
      }
      console.log('\n')
    } catch (error: any) {
      logError(error.message)
    }
  })

cli.command('init [timer]', 'init record your life').action(async (timer) => {
  if (timer < 1000) {
    return
  }
  await init(timer ?? 300_000, config) // 5 min = 5 * 60 * 1000
})

cli.help()
cli.parse()

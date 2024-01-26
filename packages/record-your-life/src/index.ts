import path from 'node:path'
import fsp from 'node:fs/promises'
import { exec } from 'node:child_process'
import { existsSync } from 'node:fs'
import { cac } from 'cac'
import { Usage, backDate, getYMD } from '@record-your-life/shared'
import color from 'picocolors'
import { CONFIG_FILE_PATH, __dirname } from './constant'
import { Logger, logError, logWarn } from './logger'
import { highlight, init, initConfig } from './utils'

const config = initConfig()
const cli = cac('record-your-life')

cli.command('set <storagePath>').action(async (storagePath) => {
  try {
    if (!existsSync(storagePath)) {
      throw new Error('no such directory')
    }
    await fsp.writeFile(CONFIG_FILE_PATH, JSON.stringify({ storagePath }))
    console.log(
      'successfuly set storage path: ' + color.green(storagePath) + '\n',
    )
  } catch (error: any) {
    logError(error.message)
  }
})

cli
  .command('[date]', 'Should like 2024-01-01, or 1 mean yesterday and so on')
  .option('--file-name', 'Indicate the file')
  .option('--table', 'Table format of usage')
  .option('--bar', 'Bar chat format of usage')
  .option('--board', 'Board chat format of usage')
  .option('--list', 'List of apps')
  .option('--detail', 'Show the unused apps')
  .action(
    async (date: string, { table, list, bar, board, detail, fileName }) => {
      try {
        const today = getYMD()
        if (!date) {
          date = today
          console.log(date)
        } else {
          const step = -date
          if (Number.isNaN(step)) {
            logWarn(
              `unkown date: "${color.underline(date)}", show tody infomration`,
            )
            date = today
          } else {
            date = backDate(today, step)
          }
        }
        const content = await fsp.readFile(
          fileName ?? path.join(config.storagePath, `${date}.json`),
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
    },
  )

cli.command('watch [timer]', 'init record your life').action(async (timer) => {
  if (timer < 1000) {
    return
  }
  await init(timer ?? 300_000, config) // 5 min = 5 * 60 * 1000
})

cli.command('init [timer]').action((timer) => {
  exec(
    // eslint-disable-next-line @stylistic/max-len
    `schtasks /create /tn RecordYourLife /sc ONLOGON /tr "powershell -windowstyle hidden -command 'record-your-life watch ${
      timer ?? 300_000
    }'"`,
    (err) => {
      if (err) {
        logError(err.message)
        return
      }
      console.log(color.green('successful init'))
    },
  )
})

cli.help()
cli.parse()

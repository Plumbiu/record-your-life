/* eslint-disable @stylistic/max-len */
import chalk from 'chalk'
import {
  formatDuration,
  getHours,
  uniqueDurationByHour,
  Usage,
} from '@record-your-life/shared'

// const Unicode = {
//   LighterSquare: chalk.hex('#FFF')('■'),
//   LightSquare: chalk.hex('#FCE6C9')('■'),
//   Square: chalk.hex('#228B22')('■'),
//   DarkSquare: chalk.hex('#385E0F').dim('■'),
//   DarkerSquare: chalk.hex('#00C957').dim('■'),
// }
const APP_HEAD = 'Application'

const highlight = chalk.bold.white.underline

export class Logger {
  records: Record<string, Usage>
  nameMaxLen: number
  date: string
  amount: string
  appLen: number

  constructor(records: Record<string, Usage>, date: string) {
    let amount = 0
    this.date = date
    this.records = records
    const entries = Object.entries(records)
    this.nameMaxLen = Math.max(
      ...entries.map(([key, { total }]) => {
        amount += total
        return key.length
      }),
    )
    this.appLen = entries.length
    this.amount = formatDuration(amount)
    this.nameMaxLen =
      this.nameMaxLen > APP_HEAD.length ? this.nameMaxLen : APP_HEAD.length
    console.log(
      chalk.dim('\nYou use ') +
        highlight(this.appLen) +
        chalk.dim(' apps on ') +
        highlight(this.date) +
        chalk.dim(', totally ') +
        highlight(this.amount),
    )
  }

  table() {
    const values: Array<{ app: string; duration: string }> = []
    for (const [app, { total }] of Object.entries(this.records)) {
      values.push({ app, duration: formatDuration(total) })
    }
    console.table(values)
  }

  list() {
    Object.keys(this.records).forEach((key, i) => {
      console.log(chalk.dim(i + 1 + '.') + chalk.cyan(' ' + key))
    })
  }

  bar() {
    const barData = Object.entries(this.records)
      .map(([name, { total }]) => ({
        name,
        total: total,
      }))
      .sort((a, b) => b.total - a.total)
    const maxLen = barData[0].total / 300_000
    console.log(
      chalk.green.bold(
        'Application'.padEnd(this.nameMaxLen) +
          '  Chart'.padEnd(maxLen + 4) +
          '  Duration',
      ),
    )
    for (const { name, total } of barData) {
      console.log(
        ' '.repeat(this.nameMaxLen + 2) +
          '■'.repeat(Math.ceil(total / 300_000)).padEnd(maxLen + 4, ' ') +
          formatDuration(total) +
          '\r' +
          chalk.cyan(name),
      )
    }
  }

  board() {
    const values = Object.values(this.records)
    const start = Math.ceil(
      +getHours(Math.min(...values.map((item) => item.start))),
    )
    const end = Math.ceil(
      +getHours(Math.max(...values.map((item) => item.end))),
    )
    let h = 'Time '.padEnd(this.nameMaxLen + 2)
    for (let i = start; i <= end; i++) {
      h += (i + ':00').padEnd(14)
    }
    console.log(chalk.bold.green(h))
    for (const [key, { durations }] of Object.entries(this.records)) {
      let str = ' '.repeat(this.nameMaxLen + 2)
      const durs = uniqueDurationByHour(durations)
      for (const dur of durs) {
        str += formatDuration(dur.duration).padEnd(14, ' ')
      }
      str += '\r'
      str += chalk.cyan(key)
      console.log(str)
    }
  }
}

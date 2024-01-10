/* eslint-disable @stylistic/max-len */
import color from 'picocolors'
import {
  formatDuration,
  getHours,
  uniqueDurationByHour,
  Usage,
} from '@record-your-life/shared'

// const Unicode = {
//   LighterSquare: chalk.hex('#FFF')('■'),
// }

const APP_HEAD = 'Application'

const highlight = (str: string | number) => {
  color.bold(color.white(color.underline(str)))
}

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
      color.dim('\nYou use ') +
        highlight(this.appLen) +
        color.dim(' apps on ') +
        highlight(this.date) +
        color.dim(', totally ') +
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
      console.log(color.dim(i + 1 + '.') + color.cyan(' ' + key))
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
      color.green(
        color.bold(
          'Application'.padEnd(this.nameMaxLen) +
            '  Chart'.padEnd(maxLen + 4) +
            '  Duration',
        ),
      ),
    )
    for (const { name, total } of barData) {
      console.log(
        ' '.repeat(this.nameMaxLen + 2) +
          '■'.repeat(Math.ceil(total / 300_000)).padEnd(maxLen + 4, ' ') +
          formatDuration(total) +
          '\r' +
          color.cyan(name),
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
    let h = 'Time '.padEnd(this.nameMaxLen + 3)
    for (let i = start; i <= end; i++) {
      h += (i + ':00').padEnd(14)
    }
    console.log(color.bold(color.green(h)))
    for (const [key, { durations }] of Object.entries(this.records)) {
      let str = ' '.repeat(this.nameMaxLen + 3)
      const durs = uniqueDurationByHour(durations).sort(
        (a, b) => a.time - b.time,
      )
      for (const dur of durs) {
        str += formatDuration(dur.duration).padEnd(14, ' ')
      }
      str += '\r'
      str += color.cyan(key)
      console.log(str)
    }
  }
}

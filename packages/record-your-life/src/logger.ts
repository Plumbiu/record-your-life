import color from 'picocolors'
import {
  formatDuration,
  getHours,
  uniqueDurationByHour,
  Usage,
} from '@record-your-life/shared'
import { getUtf8Length, highlight } from './utils'

interface LogUsage extends Usage {
  name: string
}

export class Logger {
  records: LogUsage[]
  nameMaxLen: number = -1
  date: string
  amount: string
  appLen: number
  unusedApps: string[] = []

  constructor(records: Record<string, Usage>, date: string) {
    let amount = 0
    this.date = date
    this.records = Object.entries(records).map(([name, usage]) => ({
      name,
      ...usage,
    }))
    for (const { total, name } of this.records) {
      if (total === 0) {
        this.unusedApps.push(name)
      } else {
        amount += total
        const len = getUtf8Length(name)
        if (len > this.nameMaxLen) {
          this.nameMaxLen = len
        }
      }
    }
    this.appLen = this.records.length
    this.amount = formatDuration(amount)
    console.log(
      color.dim('\nYou use ') +
        highlight(this.appLen - this.unusedApps.length) +
        color.dim(' apps on ') +
        highlight(this.date) +
        color.dim(', totally ') +
        highlight(this.amount),
    )
  }

  table() {
    const values: Array<{ name: string; duration: string }> = []
    for (const { name, total } of this.records) {
      if (total) {
        values.push({ name, duration: formatDuration(total) })
      }
    }
    console.table(values)
  }

  list() {
    this.records.forEach(({ name }, i) => {
      console.log(color.dim(i + 1 + '.') + color.cyan(' ' + name))
    })
  }

  bar() {
    this.records.sort((a, b) => b.total - a.total)
    const maxLen = this.records[0].total / 300_000
    console.log(
      color.green(
        color.bold(
          'App'.padEnd(this.nameMaxLen) +
            '  Chart'.padEnd(maxLen + 4) +
            '  Duration',
        ),
      ),
    )
    for (const { name, total } of this.records) {
      const duration = formatDuration(total)
      if (duration !== '0ms') {
        console.log(
          ' '.repeat(this.nameMaxLen + 2) +
            '■'.repeat(Math.ceil(total / 300_000)).padEnd(maxLen + 4, ' ') +
            duration +
            '\r' +
            color.cyan(name),
        )
      }
    }
  }

  board() {
    const start = Math.ceil(
      +getHours(Math.min(...this.records.map((item) => item.start))),
    )
    const end = Math.ceil(
      +getHours(Math.max(...this.records.map((item) => item.end))),
    )
    const PEND_LEN = 9
    let h = 'Time '.padEnd(this.nameMaxLen) + ' '
    for (let i = start; i <= end; i++) {
      h += (i + ':00').padEnd(PEND_LEN)
    }
    console.log(color.bold(color.green(h)))
    for (const { durations, name } of this.records) {
      const durs = uniqueDurationByHour(durations).sort(
        (a, b) => a.time - b.time,
      )
      if (durs.length > 0) {
        let str = ' '.repeat(this.nameMaxLen) + ' '
        for (let i = 0; i <= end - start; i++) {
          const dur = formatDuration(durs[i]?.duration, 1)
          if (dur === 'undefinedms') {
            str = ' '.repeat(PEND_LEN) + str
          } else {
            str += dur.padEnd(PEND_LEN, ' ')
          }
        }
        str += '\r'
        str += color.cyan(name)
        console.log(str)
      }
    }
  }
}

export function logError(str: string | number) {
  console.log(color.red('Error') + str)
}

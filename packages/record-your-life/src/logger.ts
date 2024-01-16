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
  records: LogUsage[] = []
  nameMaxLen: number = -1
  date: string
  amount: string
  appLen: number
  unusedApps: string[] = []

  constructor(records: Record<string, Usage>, date: string) {
    let amount = 0
    this.date = date
    for (const [name, usage] of Object.entries(records)) {
      if (usage.total === 0) {
        this.unusedApps.push(name)
      } else {
        this.records.push({
          name,
          ...usage,
        })
        amount += usage.total
        const len = getUtf8Length(name)
        if (len > this.nameMaxLen) {
          this.nameMaxLen = len
        }
      }
    }
    this.records.sort((a, b) => b.total - a.total)
    this.appLen = this.records.length
    this.amount = formatDuration(amount) ?? '0ms'
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
    console.table(
      this.records.map(({ name, total }) => ({
        name,
        duration: formatDuration(total),
      })),
    )
  }

  list() {
    this.records.forEach(({ name }, i) => {
      console.log(color.dim(i + 1 + '.') + color.cyan(' ' + name))
    })
  }

  bar() {
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
    let start = Number.POSITIVE_INFINITY
    let end = -1
    for (const record of this.records) {
      if (start > record.start) {
        start = record.start
      }
      if (end < record.end) {
        end = record.end
      }
    }
    start = Math.ceil(+getHours(start))
    end = Math.ceil(+getHours(end))
    const PEND_LEN = 9
    let h = 'Time '.padEnd(this.nameMaxLen + 2)
    for (let i = start; i <= end; i++) {
      h += (i + ':00').padEnd(PEND_LEN)
    }
    console.log(color.bold(color.green(h)))
    for (const { durations, name } of this.records) {
      const durs = uniqueDurationByHour(durations)
      if (durs.length > 0) {
        let str = ' '.repeat(this.nameMaxLen) + '  '
        for (let i = 0; i <= end - start; i++) {
          const dur = formatDuration(durs[i], 1)
          if (dur === undefined) {
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
  console.log(color.red('Error: ' + str) + '\n')
}

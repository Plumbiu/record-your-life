import color from 'picocolors'
import {
  formatDuration,
  getHours,
  uniqueDurationByHour,
  getUtf8Length,
  highlight,
} from './utils'
import { Usage, UsageWithIcon } from './types'

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

  constructor(records: Record<string, Usage> | UsageWithIcon[], date: string) {
    let amount = 0
    this.date = date
    if (Array.isArray(records)) {
      for (const usage of records) {
        if (usage.total === 0) {
          this.unusedApps.push(usage.name)
        } else {
          this.records.push(usage)
          amount += usage.total
          const len = getUtf8Length(usage.name)
          if (len > this.nameMaxLen) {
            this.nameMaxLen = len + 2
          }
        }
      }
    } else {
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
            this.nameMaxLen = len + 2
          }
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
    let str = ''
    for (let i = 0; i < this.records.length; i++) {
      const { name } = this.records[i]
      str += color.dim(i + 1 + '.') + color.cyan(' ' + name) + '\n'
    }
    return str
  }

  bar() {
    const maxLen = this.records[0].total / 300_000
    let str = color.green(
      color.bold(
        'App'.padEnd(this.nameMaxLen) +
          '  Chart'.padEnd(maxLen + 4) +
          '  Duration\n',
      ),
    )
    for (const { name, total } of this.records) {
      const duration = formatDuration(total)
      if (duration !== '0ms') {
        str +=
          color.cyan(name) +
          ' '.repeat(this.nameMaxLen - getUtf8Length(name) + 2) +
          '■'.repeat(Math.ceil(total / 300_000)).padEnd(maxLen + 4, ' ') +
          duration +
          '\n'
      }
    }
    return str
  }

  board() {
    let start = Number.POSITIVE_INFINITY
    let end = -1
    for (const record of this.records) {
      const firstStart = record.durations.find(
        (dur) => dur.duration > 60_000,
      )?.time
      if (firstStart && start > firstStart) {
        start = firstStart
      }
      if (end < record.end) {
        end = record.end
      }
    }
    start = Math.ceil(+getHours(start))
    end = Math.ceil(+getHours(end))
    const PEND_LEN = 9
    let str = 'Time '.padEnd(this.nameMaxLen)
    for (let i = start; i <= end; i++) {
      str += (i + ':00').padEnd(PEND_LEN)
    }
    str = color.bold(color.green(str)) + '\n'
    for (const { durations, name } of this.records) {
      const durs = uniqueDurationByHour(durations)
      if (!durs) {
        continue
      }
      if (durs.length > 0) {
        str +=
          color.cyan(name) + ' '.repeat(this.nameMaxLen - getUtf8Length(name))
        for (let i = 0; i <= end - start; i++) {
          const dur = formatDuration(durs[i]?.duration, 1, true)
          if (dur === undefined) {
            str += ' '.repeat(PEND_LEN)
          } else {
            str += dur.padEnd(PEND_LEN, ' ')
          }
        }
        str += '\n'
      }
    }
    return str
  }
}

export function logError(str: string | number) {
  console.log(color.red('Error: ' + str) + '\n')
}

export function logWarn(str: string | number) {
  console.log(color.yellow('Warn: ' + str) + '\n')
}

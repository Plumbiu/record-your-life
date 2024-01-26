import { Duration } from './types'

export function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function getYMD() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function toFixed(n: number, fixed = 2) {
  return n.toFixed(fixed)
}
export function formatDuration(
  time: number | undefined,
  fixed = 2,
  shouldLimit = false,
) {
  if (time === undefined || time === 0) {
    return
  }
  if (shouldLimit && time < 60_000) {
    return
  }
  let r: string = time + 'ms'
  if (time > 3600_000) {
    r = `${toFixed(time / 3600_000, fixed)}h`
  } else if (time > 60_000) {
    r = `${toFixed(time / 60_000, fixed)}min`
  } else if (time > 1_000) {
    r = `${toFixed(time / 1_000, fixed)}s`
  }
  return r
}

export function formatHour(total: number, fixed = 2) {
  return (total / 1000 / 60 / 60).toFixed(fixed)
}

export function formatTime(time: number) {
  const d = new Date(time)

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function getHours(time: number) {
  const d = new Date(time)
  return pad(d.getHours())
}

export interface HourDuration {
  time: number
  duration: number
  memory: number
  formatTime: string
}

export function uniqueDurationByHour(durations: Duration[]) {
  const tmp: Record<string, HourDuration> = {}
  let start = +getHours(durations[0].time)
  let curDur
  const end = +getHours(durations[durations.length - 1].time)
  if (start === end) {
    return
  }
  for (const { duration, time, memory } of durations) {
    if (duration) {
      const value = { time, duration, formatTime: getHours(time), memory }
      if (!curDur) {
        curDur = value
      }
      const fmtTime = getHours(time)
      tmp[fmtTime] = value
    }
  }
  for (let i = start; i <= end; i++) {
    const key = pad(i)
    if (!tmp[key]) {
      if (curDur) {
        tmp[key] = { ...curDur, formatTime: key }
      }
    }
    curDur = tmp[key]
  }
  return Object.values(tmp).sort((a, b) => a.duration - b.duration)
}

export function backDate(date: string, step: number) {
  if (step >= 0) {
    return date
  }
  const nums = date.split('-').map((item) => Number(item))
  const stepDay = nums[2] + step
  if (stepDay > 0) {
    nums[2] = stepDay
  } else {
    const month = nums[1] - 1
    if (month > 0) {
      const daysNum = monthDayNum(+nums[0])
      nums[1] = month
      nums[2] = daysNum[month - 1]
    } else {
      nums[0] = nums[0] - 1
      nums[1] = 12
      nums[2] = 31
    }
  }

  return `${nums[0]}-${pad(nums[1])}-${pad(nums[2])}`
}

export function monthDayNum(year: number) {
  const normal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (year % 4 === 0) {
    normal[1]++
  }
  return normal
}

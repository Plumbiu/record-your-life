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

export function uniqueDurationByHour(durations: Duration[]) {
  const tmp: Record<string, number> = {}
  let start = +getHours(durations[0].time)
  let curDur
  const end = +getHours(durations[durations.length - 1].time)
  if (start === end) {
    return
  }
  for (const { duration, time } of durations) {
    if (duration) {
      if (!curDur) {
        curDur = duration
      }
      const fmtTime = getHours(time)
      tmp[fmtTime] = duration
    }
  }
  for (let i = start; i <= end; i++) {
    const key = pad(i)
    if (!tmp[key]) {
      if (curDur) {
        tmp[key] = curDur
      }
    }
    curDur = tmp[key]
  }

  return Object.values(tmp).sort((a, b) => a - b)
}

import { Duration } from './types'

export function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function getYMD() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function toFixed(n: number) {
  return n.toFixed(2)
}
export function formatDuration(time: number) {
  let r: string = time + 'ms'
  if (time > 3600_000) {
    r = `${toFixed(time / 3600_000)}h`
  } else if (time > 60_000) {
    r = `${toFixed(time / 60_000)}min`
  } else if (time > 1_000) {
    r = `${toFixed(time / 1_000)}s`
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
  const tmp: Record<
    string,
    {
      time: string
      duration: number
    }
  > = {}
  for (const { duration, time } of durations) {
    const fmtTime = getHours(time)
    tmp[fmtTime] = { time: fmtTime, duration }
  }
  return Object.values(tmp)
}

export function resolveTimeArea(i: number) {
  return i > 12 ? 'pm' : 'am'
}

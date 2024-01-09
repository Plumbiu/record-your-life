import { Duration, formatTime } from '@record-your-life/shared'

export function uniqueDurations(durations: Duration[]) {
  const data: Record<string, Duration> = {}
  for (const item of durations) {
    const time = formatTime(item.time).split(' ')[1].split(':')[0]
    data[time] = item
  }
  return Object.entries(data).map(([time, { duration }]) => ({
    time,
    duration,
  }))
}

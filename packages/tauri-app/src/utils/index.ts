import { Duration } from '@record-your-life/shared'

export const COLORS = ['#FD9E40', '#9A66FF', '#FB6282', '#4CBFC0']

function c() {
  return Math.floor(Math.random() * 100 + 155).toString(16)
}

export function randomColor() {
  return `#${c()}${c()}${c()}`
}

export function getXAxes(durations: Duration[]) {
  const times: number[] = []
  for (let i = 0; i < durations.length; i++) {
    const { time } = durations[i]
    if (i > 1) {
      if (time - times[i - 1] < 1000 * 60 * 15) {
        continue
      }
    }
    times.push(time)
  }
  return times
}

export function uniqueArray(arr: (string | number)[]) {
  return [...new Set(arr)]
}

import { expect, test } from 'vitest'
import {
  type Duration,
  formatDuration,
  getHours,
  getYMD,
  pad,
  toFixed,
  uniqueDurationByHour,
} from '..'

test('pad', () => {
  let num = 1.25
  expect(pad(num)).toBe('1.25')
  num = 1
  expect(pad(num)).toBe('01')
  num = 10
  expect(pad(num)).toBe('10')
})

test('getYMD', () => {
  const r = getYMD()
  const match = /\d{4}-\d{2}-\d{2}/
  expect(match.test(r)).toBe(true)
})

test('toFixed', () => {
  let num = 1.255
  expect(toFixed(num)).toBe('1.25')
  num = 1.2
  expect(toFixed(num)).toBe('1.20')
  num = 1.2
  expect(toFixed(num, 1)).toBe('1.2')
})

test('formatDuration', () => {
  let time = undefined
  expect(formatDuration(time)).toBeUndefined()
  time = 1000
  expect(formatDuration(time)).toBe('1000ms')
  expect(formatDuration(time, 2, true)).toBeUndefined()
  time = 1001
  expect(formatDuration(time, 2)).toBe('1.00s')
  time = 60001
  expect(formatDuration(time, 2, true)).toBe('1.00min')
  time = 3600_001
  expect(formatDuration(time, 2, true)).toBe('1.00h')
})

test('getHours', () => {
  let date = new Date('2024-01-01 15:25:33')
  expect(getHours(date.getTime())).toBe('15')
  date = new Date('2024-01-01 8:25:33')
  expect(getHours(date.getTime())).toBe('08')
})

test('uniqueDurationByHour', () => {
  function genDate(h: number) {
    return new Date(`2024-08-01 ${pad(h)}:25:33`).getTime()
  }
  const duration: Duration[] = [
    {
      time: genDate(1),
      duration: 1500,
    },
    {
      time: genDate(3),
      duration: 5000,
    },
    {
      time: genDate(5),
      duration: 8000,
    },
    {
      time: genDate(6),
      duration: 16000,
    },
    {
      time: genDate(9),
      duration: 800000,
    },
    {
      time: genDate(12),
      duration: 1000000,
    },
  ]
  expect(uniqueDurationByHour(duration)).toEqual([
    1500, 1500, 5000, 5000, 8000, 16000, 16000, 16000, 800000, 800000, 800000,
    1000000,
  ])
})

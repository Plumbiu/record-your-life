import { expect, test } from 'vitest'
import { backDate, getUtf8Length } from '../utils'

test('getUtf8Length', () => {
  let str = 'hello world'
  expect(getUtf8Length(str)).toBe(11)
  str = '你好'
  expect(getUtf8Length(str)).toBe(4)
  str = '你好 world'
  expect(getUtf8Length(str)).toBe(10)
})

test('backDate', () => {
  let date = '2024-01-02'
  expect(backDate(date, -1)).toBe('2024-01-01')
  date = '2024-02-01'
  expect(backDate(date, -1)).toBe('2024-01-31')
  date = '2024-03-01'
  expect(backDate(date, -1)).toBe('2024-02-29')
  date = '2023-03-01'
  expect(backDate(date, -1)).toBe('2023-02-28')
})

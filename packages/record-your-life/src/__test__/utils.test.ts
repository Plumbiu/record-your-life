import { expect, test } from 'vitest'
import { getUtf8Length } from '../utils'

test('getUtf8Length', () => {
  let str = 'hello world'
  expect(getUtf8Length(str)).toBe(11)
  str = '你好'
  expect(getUtf8Length(str)).toBe(4)
  str = '你好 world'
  expect(getUtf8Length(str)).toBe(10)
})

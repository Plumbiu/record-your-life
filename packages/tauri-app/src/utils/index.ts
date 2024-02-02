export const COLORS = ['#FD9E40', '#9A66FF', '#FB6282', '#4CBFC0']

export function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

export function uniqueArray(arr: (string | number)[]) {
  return [...new Set(arr)]
}

export function chunkArray<T>(arr: T[], splitNum: number = 4) {
  splitNum = Math.floor(splitNum)
  const result = []
  for (let i = 0; i < arr.length - splitNum; i += splitNum) {
    result.push(arr[i])
  }
  return result
}

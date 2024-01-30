export const COLORS = ['#FD9E40', '#9A66FF', '#FB6282', '#4CBFC0']

function c() {
  return Math.floor(Math.random() * 200 + 55).toString(16)
}
export function randomColor() {
  return `#${c()}${c()}${c()}`
}

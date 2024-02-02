export const COLORS = ['#FD9E40', '#9A66FF', '#FB6282', '#4CBFC0']

export function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

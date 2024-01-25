export function randomColor() {
  const colors = ['#FD9E40', '#9A66FF', '#FB6282', '#4CBFC0']
  return colors[Math.floor(Math.random() * colors.length)]
}

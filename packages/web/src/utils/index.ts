/* eslint-disable @stylistic/no-mixed-operators */
export function randomColor() {
  const colors = ['#68CDDB', '#62B041', '#AFC271']

  return colors[Math.floor(Math.random() * 3)]
}

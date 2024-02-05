import {
  Chart as _Chart,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'

_Chart.register(
  LineController,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
)

_Chart.defaults.backgroundColor = '#999'
_Chart.defaults.color = '#aaa'
_Chart.defaults.font.size = 15
_Chart.defaults.aspectRatio = 1.35
_Chart.defaults.borderColor = '#222'

export const Chart = _Chart

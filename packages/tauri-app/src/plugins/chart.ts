import {
  Chart as _Chart,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { formatDuration } from '@record-your-life/shared'

_Chart.register(
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
)

_Chart.defaults.backgroundColor = '#999'
_Chart.defaults.color = '#aaa'
_Chart.defaults.font.size = 15
_Chart.defaults.aspectRatio = 1.35
_Chart.defaults.borderColor = '#333'

export const Chart = _Chart

export const CHART_OPTIONS = {
  options: {
    scales: {
      y: {
        ticks: {
          callback(value: any) {
            if (typeof value === 'string') {
              return value
            }
            return formatDuration(value, 1)
          },
        },
      },
    },
  },
}

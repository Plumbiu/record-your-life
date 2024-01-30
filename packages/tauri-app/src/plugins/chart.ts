import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
)

export default Chart

import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Filler,
  Legend,
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
  Legend,
)

export default Chart

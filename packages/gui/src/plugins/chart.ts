import {
  Chart,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Filler,
  Legend,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  Filler,
  CategoryScale,
  LinearScale,
  Legend,
)

export default Chart

<script setup lang="ts">
import Chart from '@/plugins/chart'
import { COLORS } from '@/utils'
import {
  HourDuration,
  Duration,
  formatTime,
  uniqueDurationByHour,
} from '@record-your-life/shared'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  total: string | undefined
  data: Duration[]
}>()

let data: HourDuration[] = []
const isEmpty = ref(false)

try {
  const uniqueData = uniqueDurationByHour(props.data)
  if (!uniqueData || uniqueData.length === 0) {
    throw new Error('empty')
  }
  data = uniqueData
} catch (error) {
  isEmpty.value = true
}

onMounted(() => {
  const elm = document.getElementById('chart_item')
  if (elm) {
    Chart.defaults.backgroundColor = '#666'
    Chart.defaults.color = '#aaa'
    Chart.defaults.font.size = 15
    Chart.defaults.aspectRatio = 1.85
    Chart.defaults.borderColor = '#333'
    new Chart(elm as any, {
      type: 'line',
      options: {
        scales: {
          y: {
            display: true,
            title: {
              display: true,
              text: 'Time',
            },
            ticks: {
              callback(value) {
                return value + 'min'
              },
            },
          },
          y1: {
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Memory',
            },
            ticks: {
              callback(value) {
                return value + 'mb'
              },
            },
            // grid line settings
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            },
          },
        },
      },
      data: {
        labels: data.map((row) =>
          formatTime(row.time).split(' ')[1].slice(0, -3),
        ),
        datasets: [
          {
            borderColor: COLORS[0],
            label: 'Time',
            data: data.map((row) => row.duration / 1000 / 60),
            fill: true,
            backgroundColor: COLORS[0] + '45',
            borderWidth: 4,
            yAxisID: 'y',
          },
          {
            borderColor: COLORS[1],
            label: 'Memory',
            data: data.map((row) => row.memory / 1024 / 1024),
            fill: true,
            backgroundColor: COLORS[1] + '45',
            borderWidth: 4,
            yAxisID: 'y1',
          },
        ],
      },
    })
  }
})
</script>

<template>
  <div v-if="!isEmpty && data && data.length > 0" class="chart">
    <canvas id="chart_item" />
  </div>
</template>

<style scoped>
.chart {
  flex: 1;
  border-radius: 4px;
}
</style>

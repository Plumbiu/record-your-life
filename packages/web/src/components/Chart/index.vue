<script setup lang="ts">
import {
  HourDuration,
  Duration,
  formatTime,
  uniqueDurationByHour,
} from '@record-your-life/shared'
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import { randomColor } from '@/utils'

const props = defineProps<{
  name: string
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
  const elm = document.getElementById(props.name)
  if (elm) {
    Chart.defaults.backgroundColor = '#333'
    const color = randomColor()
    new Chart(elm as any, {
      type: 'line',
      options: {
        scales: {
          y: {
            stacked: true,
          },
        },
        plugins: {
          legend: {
            title: {
              display: true,
              text: props.total,
            },
          },
        },
      },
      data: {
        labels: data.map((row) => formatTime(row.time).split(' ')[1]),
        datasets: [
          {
            borderColor: color,
            label: props.name,
            data: data.map((row) => row.duration / 1000 / 60),
            fill: true,
            borderWidth: 3,
            tension: 0.4,
          },
        ],
      },
    })
  }
})
</script>

<template>
  <div v-if="!isEmpty && data && data.length > 0" class="chart">
    <canvas :id="name" />
  </div>
</template>

<style scoped>
.chart {
  width: 420px;
  margin: 6px;
  background-color: #111;
  border-radius: 4px;
  padding: 12px;
}
</style>

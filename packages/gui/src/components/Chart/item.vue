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
  name: string
  total: string | undefined
  data: Duration[]
}>()

console.log({ data: props.data })

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
    const color1 = COLORS[0]
    const color2 = COLORS[1]
    Chart.defaults.backgroundColor = '#333'
    Chart.defaults.font.size = 18
    Chart.defaults.aspectRatio = 1.7
    Chart.defaults.borderColor = '#333'
    new Chart(elm as any, {
      type: 'line',
      options: {
        scales: {
          x: {
            display: true,
            title: {
              display: true,
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Usage Time/min',
            },
          },
        },
      },
      data: {
        labels: data.map((row) => formatTime(row.time).split(' ')[1]),
        datasets: [
          {
            borderColor: color1,
            label: props.name,
            data: data.map((row) => row.duration / 1000 / 60),
            fill: true,
            backgroundColor: color1 + '15',
            borderWidth: 4,
          },
          {
            borderColor: color2,
            label: props.name + ' usage',
            data: data.map((row) => row.memory),
            fill: true,
            backgroundColor: color1 + '15',
            borderWidth: 4,
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
  height: max-content;
  margin: 8px;
  border-radius: 4px;
  padding: 12px;
}
</style>

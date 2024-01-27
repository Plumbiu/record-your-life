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

function ticksCallback(num: string | number, unit: 'mb' | 'min') {
  if (typeof num === 'string') {
    return num
  }
  return num.toFixed(1) + unit
}

onMounted(() => {
  const elm = document.getElementById('canvas')
  if (elm) {
    Chart.defaults.backgroundColor = '#999'
    Chart.defaults.color = '#aaa'
    Chart.defaults.font.size = 15
    Chart.defaults.borderColor = '#333'
    new Chart(elm as any, {
      type: 'line',
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              footer(value) {
                console.log({ value })

                return 'value'
              },
            },
          },
        },
        scales: {
          y: {
            display: true,
            title: {
              display: true,
              text: 'Time',
            },
            ticks: {
              callback(value) {
                return ticksCallback(value, 'min')
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
                return ticksCallback(value, 'mb')
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
  <div v-if="!isEmpty && data && data.length > 0" class="canvas_container">
    <canvas id="canvas" />
  </div>
</template>

<style scoped>
.canvas_container {
  flex: 1;
  border-radius: 4px;
}
</style>

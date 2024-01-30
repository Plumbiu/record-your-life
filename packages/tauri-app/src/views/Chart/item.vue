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
  const elm = document.getElementById('canvas')
  if (elm) {
    Chart.defaults.backgroundColor = '#999'
    Chart.defaults.color = '#aaa'
    Chart.defaults.font.size = 15
    Chart.defaults.aspectRatio = 1.35
    Chart.defaults.borderColor = '#333'
    new Chart(elm as any, {
      type: 'line',
      options: {
        scales: {
          y: {
            max: data[data.length - 1].duration * 1.15,
            min: data[0].duration,
            ticks: {
              callback(value) {
                if (typeof value === 'string') {
                  return value
                }
                return (value / 1000 / 60 / 60).toFixed(1) + 'h'
              },
            },
          },
        },
      },
      data: {
        labels: [
          ...new Set(
            ...[
              data.map((row) =>
                formatTime(row.time).split(' ')[1].slice(0, -3),
              ),
            ],
          ),
        ],
        datasets: [
          {
            borderColor: COLORS[0],
            data: data.map((row) => row.duration),
            fill: true,
            backgroundColor: COLORS[0] + '45',
            borderWidth: 4,
          },
        ],
      },
    })
  }
})
</script>

<template>
  <div v-if="!isEmpty && data?.length > 0" class="canvas_container">
    <canvas id="canvas" />
  </div>
</template>

<style scoped>
.canvas_container {
  flex: 1;
  border-radius: 4px;
}
</style>

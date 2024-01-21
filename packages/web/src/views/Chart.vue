<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ChartCmp from '@/components/Chart/index.vue'
import { NButton, NEmpty } from 'naive-ui'
import request from '@/utils/request'
import { getYMD, formatDuration } from '@record-your-life/shared'

const route = useRoute()
console.log({ route })

const usage = await request.get(`/date/${route.query?.date ?? getYMD()}`)
const isEmpty = ref(false)

onMounted(() => {
  console.log(route)
})
</script>

<template>
  <div class="chart_wrapper" v-if="Object.keys(usage?.data ?? {}).length > 0">
    <div v-for="(value, key) of usage.data" :key="key">
      <ChartCmp
        :name="(key as unknown as string)"
        :total="formatDuration(value.total)"
        :data="value.durations ?? []"
      />
    </div>
  </div>
  <canvas id="chart" />
  <NEmpty v-if="isEmpty">
    <template #extra>
      <NButton size="small">看看别的</NButton>
    </template>
  </NEmpty>
</template>

<style scoped>
.chart_wrapper {
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  flex-wrap: wrap;
  width: 100%;
  height: 500px;
}
#chart {
  height: 100%;
  width: 100%;
}
</style>

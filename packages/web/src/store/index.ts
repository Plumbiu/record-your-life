import { defineStore } from 'pinia'
import {
  UsageMap,
  backDate,
  formatHour,
  formatTime,
  getYMD,
} from '@record-your-life/shared'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAppByDate, getDates } from '@/api'

export const useDateStore = defineStore('dates', () => {
  const dates = ref<string[]>([])
  async function initDate() {
    dates.value = await getDates()
  }
  return { dates, initDate }
})

export const useAppStore = defineStore('app', () => {
  const usage = ref<UsageMap>({})
  const prevUsage = ref<UsageMap>({})
  const route = useRoute()

  const firstApp = computed(() => {
    return Object.keys(usage.value)[0]
  })

  const prevTotal = computed(() => {
    return Object.values(prevUsage.value).reduce(
      (prev, curr) => prev + curr.total,
      0,
    )
  })

  const total = computed(() => {
    return Object.values(usage.value).reduce(
      (prev, curr) => prev + curr.total,
      0,
    )
  })

  const timeRate = computed(() => {
    return formatHour(total.value - prevTotal.value ?? 0, 1)
  })

  const numRate = computed(() => {
    return Object.keys(usage).length - Object.keys(prevUsage).length
  })

  function getCurrentApp() {
    return usage.value?.[route.query.app as string] ?? undefined
  }

  const startAndEnd = computed<[string, string]>(() => {
    let start = Number.POSITIVE_INFINITY
    let end = -1
    for (const item of Object.values(usage.value)) {
      if (start > item.start) {
        start = item.start
      }
      if (end < item.end) {
        end = item.end
      }
    }
    return [formatTime(start).split(' ')[1], formatTime(end).split(' ')[1]]
  })

  async function initApp(date: string = getYMD()) {
    usage.value = (await getAppByDate(date)) ?? {}
    prevUsage.value = (await getAppByDate(backDate(date, -1))) ?? {}
  }
  return {
    usage,
    total,
    initApp,
    getCurrentApp,
    startAndEnd,
    prevTotal,
    timeRate,
    numRate,
    firstApp,
    date: route.query.date,
  }
})

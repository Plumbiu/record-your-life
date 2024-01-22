import { defineStore } from 'pinia'
import {
  UsageArr,
  backDate,
  formatHour,
  getYMD,
} from '@record-your-life/shared'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getAppByDate, getDates } from '@/api'

export const useDateStore = defineStore('dates', () => {
  const dates = ref<string[]>([])
  const selectedDate = ref<string>(getYMD())

  async function initDate() {
    dates.value = await getDates()
  }
  return { dates, initDate, selectedDate }
})

export const useAppStore = defineStore('app', () => {
  const usage = ref<UsageArr[]>([])
  const prevUsage = ref<UsageArr[]>([])
  const route = useRoute()

  const prevTotal = computed(() => {
    return prevUsage.value.reduce((prev, curr) => prev + curr.total, 0)
  })

  const total = computed(() => {
    return usage.value.reduce((prev, curr) => prev + curr.total, 0)
  })

  const timeRate = computed(() => {
    return formatHour(total.value - (prevTotal.value ?? 0), 1)
  })

  const numRate = computed(() => {
    return usage.value.length - prevUsage.value.length
  })

  function getCurrentApp() {
    return usage.value.find((item) => item.name === route.query.app)
  }

  async function initApp(date: string = getYMD()) {
    usage.value = (await getAppByDate(date)) ?? []
    prevUsage.value = (await getAppByDate(backDate(date, -1))) ?? []
  }

  return {
    usage,
    total,
    initApp,
    getCurrentApp,
    prevTotal,
    timeRate,
    numRate,
    date: route.query.date,
  }
})

export const useModeStore = defineStore('mode', () => {
  const mode = ref<'App' | 'Summary'>('Summary')
  return {
    mode,
  }
})

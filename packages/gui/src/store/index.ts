import { defineStore } from 'pinia'
import { UsageArr, getYMD } from '@record-your-life/shared'
import { computed, ref, watch } from 'vue'

export const useDateStore = defineStore('dates', () => {})

export const useAppStore = defineStore('app', () => {
  const usage = ref<UsageArr[]>([])
  const activeAppName = ref('')
  const allDate = ref<string[]>([])
  const selectedDate = ref<string>(getYMD())
  const activeApp = ref<UsageArr>()

  async function initDate() {
    allDate.value = await window.api.getDates()
  }
  const total = computed(() =>
    usage.value.reduce((prev, curr) => prev + curr.total, 0),
  )

  async function initApp(date: string = getYMD()) {
    usage.value = (await window.api.getAppByDate(date)) ?? []
    console.log(usage.value)
  }

  watch(activeAppName, (value) => {
    activeApp.value = usage.value.find((item) => item.name === value)
  })

  return {
    usage,
    total,
    initApp,
    activeAppName,
    activeApp,
    date: '2022-01-20',
    allDate,
    initDate,
    selectedDate,
  }
})

export const useModeStore = defineStore('mode', () => {
  const mode = ref<'App' | 'Summary'>('Summary')
  return {
    mode,
  }
})

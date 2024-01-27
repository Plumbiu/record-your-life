import { defineStore } from 'pinia'
import { UsageWithIcon, getYMD } from '@record-your-life/shared'
import { computed, ref, watch } from 'vue'

export const useDateStore = defineStore('dates', () => {})

export const useAppStore = defineStore('app', () => {
  const usage = ref<UsageWithIcon[]>([])
  const activeAppName = ref('')
  const allDate = ref<string[]>([])
  const selectedDate = ref<string>(getYMD())
  const activeApp = ref<UsageWithIcon>()

  const total = computed(() =>
    usage.value.reduce((prev, curr) => prev + curr.total, 0),
  )

  const dateOptions = computed(() =>
    allDate.value.map((item) => ({
      label: item,
      value: item,
    })),
  )

  async function initApp(date: string = getYMD()) {
    usage.value = (await window.api.getAppByDate(date)) ?? []
    console.log(usage.value)
    const first = usage.value?.[0]?.name
    if (first) {
      activeAppName.value = first
    }
  }

  async function initDate() {
    allDate.value = await window.api.getDates()
  }

  watch(selectedDate, async (date) => {
    await initApp(date as string)
    const first = usage.value?.[0]?.name
    if (first) {
      activeAppName.value = first
    }
  })

  watch(activeAppName, (value) => {
    activeApp.value = usage.value.find((item) => item.name === value)
  })

  return {
    usage,
    total,
    initApp,
    activeAppName,
    activeApp,
    allDate,
    dateOptions,
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

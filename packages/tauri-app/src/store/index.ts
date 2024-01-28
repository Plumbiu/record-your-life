import { defineStore } from 'pinia'
import { UsageMap, UsageWithIcon, getYMD } from '@record-your-life/shared'
import { computed, ref, watch } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'

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
    const raw: string = await invoke('app', { file: date + '.json' })
    console.log({ raw })
    if (!raw) {
      return
    }

    const parsed: UsageMap = JSON.parse(raw)
    const result: UsageWithIcon[] = []
    await Promise.all(
      Object.entries(parsed).map(async ([name, value]) => {
        try {
          if (value.path && value.total > 0 && value.durations.length > 2) {
            const icon: string =
              'data:image/png;base64, ' +
              (await invoke('icon', { file: value.path }))
            result.push({
              name,
              ...value,
              icon,
            })
          }
        } catch (error) {}
      }),
    )
    console.log({ result })

    usage.value = result
    console.log(usage.value)
    const first = usage.value?.[0]?.name
    if (first) {
      activeAppName.value = first
    }
  }

  async function initDate() {
    allDate.value = await invoke('dates', {
      file: 'E:\\program\\record-your-life',
    })
    console.log(allDate.value)
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

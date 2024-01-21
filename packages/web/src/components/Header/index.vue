<script setup lang="ts">
import GithubIcon from '../icons/Github.vue'
import { useDates } from '@/store/index'
import { ref, watch } from 'vue'
import { NSelect } from 'naive-ui'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

interface SelectOption {
  label: string
  value: string
}
const router = useRouter()

const store = useDates()
const dates = store.dates
const range = ref<[string, string]>([dates[0], dates[dates.length - 1]])
const selectedValue = ref(range.value[1])
const selectedDates = ref<string[]>([])
const options = ref<SelectOption[]>([])
const apps = ref<string[]>([])

watch(
  range,
  (value) => {
    const start = dates.findIndex((item) => item === value[0])
    const end = dates.findIndex((item) => item === value[1])
    selectedDates.value = dates.slice(start, end + 1)
    options.value = selectedDates.value.map((item) => ({
      label: item,
      value: item,
    }))
  },
  { immediate: true },
)

watch(
  selectedValue,
  async (date) => {
    apps.value = (await request.get(`/app/${date}`)).data
    router.push({
      name: 'chart',
      path: '/chart',
      query: { date },
    })
  },
  { immediate: true },
)
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="logo">LOGO</div>
      <NSelect
        style="width: 140px"
        v-model:value="selectedValue"
        :options="options"
      />
    </div>
    <div class="icons">
      <GithubIcon />
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #222;
}
.logo {
  font-weight: 700;
}

.icons,
.left {
  display: flex;
  gap: 12px;
  align-items: center;
}
.left {
  flex: 1;
}
</style>

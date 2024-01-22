<script setup lang="ts">
import { ref, watch } from 'vue'
import { NSelect, NIcon } from 'naive-ui'
import { formatHour } from '@record-your-life/shared'
import { useAppStore, useDateStore } from '@/store'
import RateUpIcon from '@/components/icons/RateUp.vue'
import RateDownIcon from '@/components/icons/RateDown.vue'
import AppItem from './AppItem.vue'
import Panel from './Panel.vue'
import { useRouter } from 'vue-router'

enum AppOpt {
  ASC = -1,
  DESC = +1,
}
const router = useRouter()
const appStore = useAppStore()
const timeRate = appStore.timeRate
const numRate = appStore.numRate
const dateStore = useDateStore()
await dateStore.initDate()
const dates = dateStore.dates
const selectedDate = ref<string>(
  localStorage.getItem('date') ?? dates[dates.length - 1],
)
const selectedOrder = ref<AppOpt>(AppOpt.ASC)

const dateOptions = dates.map((item) => ({
  label: item,
  value: item,
}))

const orderOptions = [
  {
    label: 'Asc',
    value: AppOpt.DESC,
  },
  {
    label: 'Desc',
    value: AppOpt.ASC,
  },
]

watch(
  selectedDate,
  async (date) => {
    localStorage.setItem('date', date)
    await appStore.initApp(date as string)
    const fisrtAppName = appStore.usage?.[0].name
    if (fisrtAppName) {
      await router.push({
        name: 'chart',
        query: {
          app: fisrtAppName,
        },
      })
    }
  },
  { immediate: true },
)

watch(selectedOrder, (order) => {
  appStore.usage = appStore.usage.sort((a, b) => order * (a.total - b.total))
})
</script>

<template>
  <div class="sub_sider f-c">
    <Panel
      tl="Total usage time"
      :bl="`${formatHour(appStore.total)}h`"
      :br="`${+appStore.timeRate < 0 ? '' : '+'}${appStore.timeRate}h`"
    >
      <template #tr>
        <NSelect
          style="width: 130px"
          v-model:value="selectedDate"
          :options="dateOptions"
        />
      </template>
      <template #br>
        <NIcon size="large" :color="+timeRate < 0 ? 'red' : 'green'">
          <component :is="+timeRate < 0 ? RateDownIcon : RateUpIcon" />
        </NIcon>
      </template>
    </Panel>
    <Panel
      tl="App usage"
      :bl="Object.keys(appStore.usage).length"
      :br="`${+appStore.timeRate < 0 ? '' : '+'}${numRate}`"
    >
      <template #tr>
        <NSelect
          style="width: 130px"
          v-model:value="selectedOrder"
          :options="orderOptions"
        />
      </template>
      <template #br>
        <NIcon size="large" :color="+numRate < 0 ? 'red' : 'green'">
          <component :is="+numRate < 0 ? RateDownIcon : RateUpIcon" />
        </NIcon>
      </template>
    </Panel>
    <div class="app" v-for="item in appStore.usage" :key="item.name">
      <AppItem
        :app="item.name"
        :is-active="$route.query.app === item.name"
        :total="formatHour(item.total)"
      />
    </div>
  </div>
</template>

<style scoped>
.sub_sider {
  position: fixed;
  left: 80px;
  top: 0;
  bottom: 0;
  width: 340px;
  flex-direction: column;
  background-color: #181818;
  overflow: auto;
}
.sub_sider::after {
  content: '';
  position: fixed;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.3);
  filter: blur(3px);
}
.app {
  box-sizing: border-box;
  padding: 4px 12px;
  margin-top: 6px;
  width: 90%;
  border-radius: 2px;
}
.app > div {
  cursor: pointer;
  transition: background-color 125ms;
}
.app:hover {
  background-color: #333;
}
</style>

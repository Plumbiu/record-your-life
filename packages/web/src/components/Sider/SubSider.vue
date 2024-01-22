<script setup lang="ts">
import { ref, watch } from 'vue'
import { NSelect, NIcon } from 'naive-ui'
import { useAppStore, useDateStore } from '@/store'
import { formatHour } from '@record-your-life/shared'
import RateUpIcon from '@/components/icons/RateUp.vue'
import RateDownIcon from '@/components/icons/RateDown.vue'
import AppItem from './AppItem.vue'
import Panel from './Panel.vue'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const dateStore = useDateStore()
await dateStore.initDate()

const router = useRouter()
const dates = dateStore.dates
const selectedValue = ref<string>(
  localStorage.getItem('date') ?? dates[dates.length - 1],
)
const options = dates.map((item) => ({
  label: item,
  value: item,
}))

watch(
  selectedValue,
  (date) => {
    localStorage.setItem('date', date)
    router.push({
      name: 'chart',
      query: {
        date,
        app: appStore.firstApp,
      },
    })
  },
  { immediate: true },
)
</script>

<template>
  <div class="sub_sider f-c">
    <Panel
      tl="Total usage time"
      :bl="`${formatHour(appStore.total)} h`"
      :br="`${appStore.timeRate} h`"
    >
      <template #tr>
        <NSelect
          style="width: 130px"
          v-model:value="selectedValue"
          :options="options"
        />
      </template>
      <template #br>
        <NIcon size="large" :color="+appStore.timeRate < 0 ? 'red' : 'green'">
          <component :is="+appStore.timeRate < 0 ? RateDownIcon : RateUpIcon" />
        </NIcon>
      </template>
    </Panel>
    <Panel
      tl="App usage"
      :bl="Object.keys(appStore.usage).length"
      :br="appStore.numRate"
    >
      <template #tr>
        <NSelect
          style="width: 130px"
          v-model:value="selectedValue"
          :options="options"
        />
      </template>
      <template #br>
        <NIcon size="large" :color="+appStore.numRate < 0 ? 'red' : 'green'">
          <component :is="+appStore.numRate < 0 ? RateDownIcon : RateUpIcon" />
        </NIcon>
      </template>
    </Panel>
    <div class="app" v-for="(value, key) in appStore.usage" :key="key">
      <AppItem
        :app="key"
        :is-active="$route.query.app === key"
        :total="formatHour(value.total)"
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

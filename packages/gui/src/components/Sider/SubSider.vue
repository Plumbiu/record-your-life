<script setup lang="ts">
import { ref, watch } from 'vue'
import { NSelect } from 'naive-ui'
import { useAppStore } from '@/store'
import AppItem from './AppItem.vue'
import { formatHour } from '@record-your-life/shared'

const store = useAppStore()
await store.initDate()
const selectedDate = ref<string>(store.allDate[store.allDate.length - 1])
await store.initApp(selectedDate.value as string)
store.activeAppName = store.usage?.[0]?.name ?? ''

const dateOptions = store.allDate.map((item) => ({
  label: item,
  value: item,
}))

watch(selectedDate, async (date) => {
  console.log({ date })
  await store.initApp(date as string)
})
</script>

<template>
  <div class="sub_sider f-c">
    <NSelect
      size="small"
      style="width: 125px"
      v-model:value="selectedDate"
      :options="dateOptions"
    />
    <div class="app" v-for="item in store.usage" :key="item.name">
      <AppItem
        @click="store.activeAppName = item.name"
        :app="item.name"
        :is-active="store.activeAppName === item.name"
        :total="formatHour(item.total)"
      />
    </div>
  </div>
</template>

<style scoped>
.sub_sider {
  position: fixed;
  left: 60px;
  top: 0;
  bottom: 0;
  width: 180px;
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
  margin: 0 auto;
  margin-top: 6px;
  width: 96%;
  border-radius: 2px;
}
</style>

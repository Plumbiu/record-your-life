<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAppStore } from '@/store'
import AppItem from './AppItem.vue'
import { formatDuration } from '@record-your-life/shared'

const store = useAppStore()
const selectedDate = ref<string>(store.allDate[store.allDate.length - 1])
await store.initApp(selectedDate.value as string)
store.activeAppName = store.usage?.[0]?.name ?? ''

watch(selectedDate, async (date) => {
  console.log({ date })
  await store.initApp(date as string)
})
</script>

<template>
  <div class="sub_sider f-c">
    <div class="app" v-for="item in store.usage" :key="item.name">
      <AppItem
        v-if="item.total"
        @click="store.activeAppName = item.name"
        :app="item.name"
        :icon="item.icon"
        :is-active="store.activeAppName === item.name"
        :total="formatDuration(item.total)"
      />
    </div>
  </div>
</template>

<style scoped>
.sub_sider {
  box-sizing: border-box;
  position: fixed;
  left: 50px;
  top: var(--cet-header-h);
  bottom: 0;
  width: var(--sider-sub);
  border-right: 1px solid #282828;
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

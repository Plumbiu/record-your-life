<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { useAppStore } from '@/store'
import AppItem from './AppItem.vue'

const store = useAppStore()
</script>

<template>
  <div class="sub_sider f-c">
    <NSelect
      style="width: 96%"
      v-model:value="store.selectedDate"
      :options="store.dateOptions"
    />
    <div class="app" v-for="item in store.usage" :key="item.name">
      <AppItem
        v-if="item.total"
        @click="store.activeAppName = item.name"
        :app="item.name"
        :icon="item.icon"
        :is-active="store.activeAppName === item.name"
        :total="item.total"
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
  flex-direction: column;
  background-color: var(--bg-cmp);
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

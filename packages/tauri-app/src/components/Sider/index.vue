<script setup lang="ts">
import { NSelect } from 'naive-ui'
import { useAppStore } from '@/store'
import AppItem from './AppItem.vue'

const store = useAppStore()
</script>

<template>
  <div class="sider">
    <div>
      <NSelect
        style="background-color: #191919 !important"
        v-model:value="store.selectedDate"
        :options="store.dateOptions"
      />
    </div>
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
.sider {
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sider);
  flex-direction: column;
  background-color: var(--bg-cmp);
  overflow: auto;
}
.app {
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 6px;
  border-radius: 2px;
}
</style>

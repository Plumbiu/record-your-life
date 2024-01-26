<script setup lang="ts">
import { useAppStore } from '@/store'
import Avatar from '../ui/Avatar.vue'
import { formatDuration } from '@record-your-life/shared'

const store = useAppStore()
</script>

<template>
  <div class="panel">
    <div class="panel_item">
      <Avatar :src="store.activeApp?.icon" />
      <div>{{ store.activeApp?.name }}</div>
    </div>
    <div class="panel_item">
      <div>
        <div class="num">{{ formatDuration(store.activeApp?.total) }}</div>
      </div>
      <div class="f-c" style="width: 125px">
        <slot name="br" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  border-radius: 2px;
  margin: 8px auto 16px;
  background-color: #222;
  box-sizing: border-box;
  padding: 12px 16px;
}
.panel_item {
  display: flex;
  align-items: center;
}
.num {
  font-weight: 700;
  font-size: 18px;
}
.fade {
  color: #777;
}
</style>

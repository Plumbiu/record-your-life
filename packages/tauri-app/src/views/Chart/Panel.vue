<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vue'
import Tag from '@/components/ui/Tag.vue'
import { useAppStore } from '@/store'
import { formatDuration } from '@record-your-life/shared'

const appStore = useAppStore()
</script>

<template>
  <div class="panel">
    <Avatar :src="appStore.activeApp?.icon" />
    <div>
      {{ appStore.activeAppName }}
    </div>
    <Tag>
      {{ formatDuration(appStore.activeApp?.total) }}
    </Tag>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  margin: 12px auto;
  background-color: #333;
  border-radius: 4px;
}
</style>

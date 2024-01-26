<script setup lang="ts">
import { useAppStore } from '@/store'
import { watch, ref } from 'vue'
import { NSelect } from 'naive-ui'
import GithubIcon from '../icons/Github.vue'

const store = useAppStore()
await store.initDate()
const selectedDate = ref<string>(store.allDate[store.allDate.length - 1])

watch(selectedDate, async (date) => {
  console.log({ date })
  await store.initApp(date as string)
})
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="logo">LOGO</div>
      <NSelect
        size="small"
        style="width: 140px"
        v-model:value="selectedDate"
        :options="store.dateOptions"
      />
    </div>
    <div class="icons">
      <GithubIcon />
    </div>
  </div>
</template>

<style scoped>
.header {
  box-sizing: border-box;
  position: fixed;
  top: var(--cet-header-h);
  left: var(--sider);
  right: 0;
  display: flex;
  border-bottom: 1px solid #282828;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #181818;
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

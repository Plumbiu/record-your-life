<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
import Sider from '@/components/Sider/index.vue'
import Tab from '@/components/Tab/index.vue'
import { useAppStore } from '@/store'
import { onMounted, ref } from 'vue'

const isDone = ref(false)
const store = useAppStore()
onMounted(async () => {
  await store.initDate()
  await store.initApp(store.allDate[store.allDate.length - 1])
  isDone.value = true
})
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <Suspense>
      <div v-if="isDone" class="container">
        <Sider />
        <div class="main">
          <div class="view">
            <Tab />
          </div>
        </div>
      </div>
    </Suspense>
    <NGlobalStyle />
  </NConfigProvider>
</template>

<style scoped>
.main {
  width: calc(100vw - var(--sider));
  margin-left: var(--sider);
}
.view {
  margin-left: 12px;
  margin-right: 16px;
}
</style>

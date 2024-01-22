<script setup lang="ts">
import { watch } from 'vue'
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
import Sider from '@/components/Sider/index.vue'
import Header from '@/components/Header/index.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from './store'

const route = useRoute()
const appStore = useAppStore()

watch(
  route,
  async () => {
    await appStore.initApp(route.query.date as string)
  },
  { immediate: true },
)
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <Suspense>
      <div class="container">
        <Sider />
        <div class="main">
          <Header />
          <div class="view">
            <RouterView :key="route.fullPath" />
          </div>
        </div>
      </div>
    </Suspense>
    <NGlobalStyle />
  </NConfigProvider>
</template>

<style scoped>
.main {
  margin-left: 420px;
  flex: 1;
}
.view {
  margin: 0 auto;
  margin-top: 24px;
}
</style>

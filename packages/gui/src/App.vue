<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
import Sider from '@/components/Sider/index.vue'
import Header from '@/components/Header/index.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
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

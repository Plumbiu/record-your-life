<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
import Sider from '@/components/Sider/index.vue'
import Header from '@/components/Header/index.vue'
import Chart from '@/views/Chart/index.vue'
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <Suspense>
      <div class="container">
        <Sider />
        <div class="main">
          <Header />
          <div class="view">
            <Chart />
          </div>
        </div>
      </div>
    </Suspense>
    <NGlobalStyle />
  </NConfigProvider>
</template>

<style scoped>
.main {
  width: calc(100vw - 300px);
  margin-top: 80px;
  margin-left: 300px;
}
.view {
  margin: 0 auto;
  margin-top: 24px;
}
</style>

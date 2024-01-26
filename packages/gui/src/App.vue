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
.container {
  margin-top: 40px;
}
.main {
  width: calc(100vw - var(--sider));
  margin-top: 80px;
  margin-left: var(--sider);
}
.view {
  width: 94%;
  margin: 24px auto 0;
}
</style>

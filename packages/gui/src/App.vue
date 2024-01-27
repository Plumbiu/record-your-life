<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
import Sider from '@/components/Sider/index.vue'
import Header from '@/components/Header/index.vue'
import Chart from '@/views/Chart/index.vue'
import Tab from '@/components/Tab/index.vue'
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <Suspense>
      <div class="container">
        <Sider />
        <div class="main">
          <div class="view">
            <Tab>
              <Chart />
            </Tab>
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

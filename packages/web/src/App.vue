<script setup lang="ts">
import { darkTheme, NConfigProvider, NGlobalStyle } from 'naive-ui'
import Sider from '@/components/Sider/index.vue'
import Header from '@/components/Header/index.vue'
import { onMounted, ref } from 'vue'
import { useDates } from './store'
import { useRoute } from 'vue-router'

const route = useRoute()
const state = useDates()
const initializing = ref(false)
onMounted(async () => {
  try {
    await state.initDates()
  } finally {
    initializing.value = true
  }
})
</script>

<template>
  <NConfigProvider :theme="darkTheme">
    <Suspense>
      <div class="container" v-if="initializing">
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
  margin-left: 60px;
  flex: 1;
}
.view {
  margin-top: 24px;
}
</style>

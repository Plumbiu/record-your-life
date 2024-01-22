<script setup lang="ts">
import { ref, watch } from 'vue'
import { NSelect, NIcon } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore, useDateStore } from '@/store'
import { formatHour } from '@record-your-life/shared'
import RateUpIcon from '@/components/icons/RateUp.vue'
import RateDownIcon from '@/components/icons/RateDown.vue'

const appStore = useAppStore()
const dateStore = useDateStore()
const router = useRouter()
const route = useRoute()
await dateStore.initDate()

const dates = dateStore.dates
const selectedValue = ref(dates[dates.length - 1])
const options = dates.map((item) => ({
  label: item,
  value: item,
}))

watch(
  selectedValue,
  async (date) => {
    const app = route.query.app ?? appStore.firstApp
    await router.push({
      name: 'chart',
      path: '/chart',
      query: { date, app },
    })
  },
  { immediate: true },
)
</script>

<template>
  <div class="sub_sider f-c">
    <div class="summary">
      <div class="top f-c">
        <div class="fade_color">Total usage time</div>
        <NSelect
          style="width: 130px"
          v-model:value="selectedValue"
          :options="options"
        />
      </div>
      <div class="bottom f-c">
        <div class="bottom_total">
          <h2>{{ formatHour(appStore.total) }} h</h2>
        </div>
        <div class="f-c" style="width: 130px">
          <span class="fade_color">{{ appStore.rate }}h</span>
          <NIcon size="large" :color="+appStore.rate < 0 ? 'red' : 'green'">
            <component :is="+appStore.rate < 0 ? RateDownIcon : RateUpIcon" />
          </NIcon>
        </div>
      </div>
    </div>
    <div class="app_panel f-c">
      <div style="gap: 8px" class="f-c">
        <NIcon size="large">
          <RateDownIcon />
        </NIcon>
        <div>App</div>
      </div>
      <div class="f-c">
        {{ Object.keys(appStore.usage).length }}
      </div>
    </div>
    <div class="app_entry" v-for="(value, key) in appStore.usage" :key="key">
      <RouterLink
        :to="{
          name: 'chart',
          path: '/chart',
          query: {
            app: key,
          },
        }"
        :class="{
          side_item__active: route.query.app === key,
        }"
      >
        <div>{{ key }}</div>
        <div class="app_value fade_color f-c">
          <span>use</span>
          <span>-</span>
          <span>{{ formatHour(value.total) }}h</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.sub_sider {
  position: fixed;
  left: 80px;
  top: 0;
  bottom: 0;
  width: 340px;
  flex-direction: column;
  background-color: #181818;
  overflow: auto;
}
.sub_sider::after {
  content: '';
  position: fixed;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.3);
  filter: blur(3px);
}
.sub_sider > div {
  margin: 8px;
  border-radius: 2px;
  width: 92%;
}

.summary,
.app_panel {
  background-color: #222;
  box-sizing: border-box;
  padding: 12px;
}
.summary {
  .top {
    justify-content: space-between;
    gap: 12px;
  }
}

.app_panel {
  justify-content: space-between;
  padding: 16px 12px;
}
.app_entry {
  box-sizing: border-box;
  padding: 4px 12px;
  margin-top: 6px;
  width: 90%;
  border-radius: 2px;
}
.app_entry > div {
  cursor: pointer;
  transition: background-color 125ms;
}

.side_item__active {
  position: relative;
}
.side_item__active::before {
  content: '';
  position: absolute;
  left: -12px;
  top: -3px;
  bottom: -3px;
  background-color: red;
  border-radius: 0 2px 2px 0;
  width: 4px;
}

.app_entry:hover {
  background-color: #333;
}

.app_value {
  gap: 4px;
}
.fade_color {
  color: #777;
}

.bottom {
  justify-content: space-between;
  margin-top: 8px;
}
</style>

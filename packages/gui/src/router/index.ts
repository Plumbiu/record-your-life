import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'chart',
    path: '/chart',
    component: () => import('@/views/Chart/index.vue'),
  },
  {
    name: 'table',
    path: '/table',
    component: () => import('@/views/Table.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

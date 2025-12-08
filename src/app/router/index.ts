import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import TheApp from '../../the-app.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/:meetingId',
    name: 'meeting',
    component: TheApp,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

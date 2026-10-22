import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import TrainingView from '../views/TrainingView.vue'
import GuideView from '../views/GuideView.vue'
import RecordsView from '../views/RecordsView.vue'
import LabView from '../views/LabView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: DashboardView },
    { path: '/train/:mode', component: TrainingView },
    { path: '/guide', component: GuideView },
    { path: '/records', component: RecordsView },
    { path: '/lab', component: LabView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

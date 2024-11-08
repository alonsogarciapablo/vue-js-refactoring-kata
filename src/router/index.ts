import { createRouter, createWebHistory } from 'vue-router'
import SignupView from '../views/signup-view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'signup',
      component: SignupView,
    },
  ],
})

export default router

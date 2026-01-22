import { createRouter, createWebHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Explore from "../pages/Explore.vue"
import Profile from "../pages/Profile.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/explore", component: Explore },
  { path: "/profile", component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

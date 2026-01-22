import { createRouter, createWebHashHistory } from "vue-router"

import Home from "../pages/Home.vue"
import Explore from "../pages/Explore.vue"
import Profile from "../pages/Profile.vue"
import PostDetails from "../pages/PostDetails.vue"
import Messages from "../pages/Messages.vue"
import Notifications from "../pages/Notifications.vue"
import Settings from "../pages/Settings.vue"
import Games from "../pages/Games.vue"
import Players from "../pages/Players.vue"
import About from "../pages/About.vue"

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/explore", name: "Explore", component: Explore },
  { path: "/profile", name: "Profile", component: Profile },

  { path: "/post/:id", name: "PostDetails", component: PostDetails },
  { path: "/messages", name: "Messages", component: Messages },
  { path: "/notifications", name: "Notifications", component: Notifications },
  { path: "/settings", name: "Settings", component: Settings },
  { path: "/games", name: "Games", component: Games },
  { path: "/players", name: "Players", component: Players },
  { path: "/about", name: "About", component: About },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

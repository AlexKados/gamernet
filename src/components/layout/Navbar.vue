<template>
  <header class="border-b border-white/10 bg-gray-950 text-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="flex items-center gap-2 font-bold tracking-tight">
        <span class="text-xl">🎮</span>
        <span>GamerNet</span>
      </RouterLink>

      <nav class="flex flex-wrap items-center gap-2">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
          :class="{ 'bg-white/10 text-white': isActive(item.to) }"
        >
          {{ item.label }}
        </RouterLink>

        <!-- Auth section -->
        <div class="ml-2 flex items-center gap-2 border-l border-white/10 pl-3">
          <template v-if="auth.isLoggedIn">
            <span class="text-sm text-white/70">
              👤 {{ auth.displayName }}
            </span>
            <button
              class="rounded-lg bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/20"
              @click="handleLogout"
            >
              Log out
            </button>
          </template>
          <RouterLink
            v-else
            to="/login"
            class="rounded-lg bg-indigo-500/80 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Log in
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue"
import { useRoute, useRouter, RouterLink } from "vue-router"
import { useAuthStore } from "../../stores/useAuthStore"
import { useUiStore } from "../../stores/useUiStore"

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const nav = computed(() => [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Profile", to: "/profile" },

  { label: "Games", to: "/games" },
  { label: "Players", to: "/players" },
  { label: "Post", to: "/post/1" },

  { label: "Messages", to: "/messages" },
  { label: "Notifications", to: "/notifications" },

  { label: "Settings", to: "/settings" },
  { label: "About", to: "/about" },
])

function isActive(path) {
  if (path.startsWith("/post/")) return route.path.startsWith("/post/")
  return route.path === path
}

async function handleLogout() {
  await auth.logout()
  ui.showToast("Logged out")
  router.push("/login")
}
</script>
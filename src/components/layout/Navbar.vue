<template>
  <header class="border-b border-white/10 bg-gray-950 text-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="flex items-center gap-2 font-bold tracking-tight">
        <span class="text-xl">🎮</span>
        <span>GamerNet</span>
      </RouterLink>

      <nav class="flex items-center gap-2">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
          :class="{ 'bg-white/10 text-white': isActive(item.to) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue"
import { useRoute, RouterLink } from "vue-router"

const route = useRoute()

const nav = computed(() => [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/explore" },
  { label: "Profile", to: "/profile" },
])

function isActive(path) {
  return route.path === path
}
</script>

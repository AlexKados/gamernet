<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold">Explore</h1>
      <p class="text-white/80">
        Find games and players
        <span class="text-white/50">· Following {{ followingCount }}</span>
      </p>
    </header>

    <ExploreFilters
      :games="allGames"
      :query="filters.query"
      :game="filters.game"
      @update="setFilters"
    />

    <UserList :users="filteredUsers" @toggle-follow="toggleFollow" />
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import ExploreFilters from "../components/explore/ExploreFilters.vue"
import UserList from "../components/explore/UserList.vue"

import { useUsersStore } from "../stores/useUsersStore"
import { useGamesStore } from "../stores/useGamesStore"
import { useUiStore } from "../stores/useUiStore"

const router = useRouter()
const route = useRoute()

const usersStore = useUsersStore()
const gamesStore = useGamesStore()
const ui = useUiStore()

const filters = ref({
  query: String(route.query.q || ""),
  game: String(route.query.game || ""),
})

const allGames = computed(() => gamesStore.games)
const followingCount = computed(() => usersStore.followingCount)

function setFilters(next) {
  filters.value = next
}

const filteredUsers = computed(() => {
  const q = filters.value.query.trim().toLowerCase()
  const g = filters.value.game

  return usersStore.users.filter((u) => {
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q) ||
      u.tags.some((t) => t.toLowerCase().includes(q))

    const matchesGame = !g || u.tags.includes(g)

    return matchesQuery && matchesGame
  })
})

function toggleFollow(userId) {
  usersStore.toggleFollow(userId)
  ui.showToast("Updated follow ✅")
}

watch(
  () => [filters.value.query, filters.value.game],
  ([q, g]) => {
    if (g) gamesStore.selectGame(g)
    else gamesStore.clearSelection()

    router.replace({
      query: {
        ...route.query,
        q: q || undefined,
        game: g || undefined,
      },
    })
  },
)
</script>

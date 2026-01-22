<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold">Explore</h1>
      <p class="text-white/80">Find games and players</p>
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
import { computed, ref } from "vue"
import ExploreFilters from "../components/explore/ExploreFilters.vue"
import UserList from "../components/explore/UserList.vue"

const allGames = ["BG3", "LoL", "Valorant", "Pathfinder: WotR", "CS2", "Fortnite"]

const filters = ref({ query: "", game: "" })

const users = ref([
  { id: 1, name: "Nina", bio: "Healer main, co-op player.", tags: ["BG3", "Support"], following: false },
  { id: 2, name: "Tom", bio: "Ranked grinder. No excuses.", tags: ["LoL", "Jungle"], following: true },
  { id: 3, name: "Kiki", bio: "FPS brain, aim training daily.", tags: ["Valorant", "CS2"], following: false },
  { id: 4, name: "Lucia", bio: "CRPGs and chaos builds only.", tags: ["Pathfinder: WotR", "BG3"], following: false },
])

function setFilters(next) {
  filters.value = next
}

const filteredUsers = computed(() => {
  const q = filters.value.query.trim().toLowerCase()
  const g = filters.value.game

  return users.value.filter((u) => {
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
  users.value = users.value.map((u) =>
    u.id === userId ? { ...u, following: !u.following } : u
  )
}
</script>

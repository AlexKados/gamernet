<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold">Home</h1>
      <p class="text-white/80">
        Welcome to GamerNet 🎮
        <span class="text-white/50">· {{ auth.displayName }}</span>
      </p>
    </header>

    <PostComposer :default-author="auth.user.name" :games="games.games" @submit="handleSubmit" />

    <div class="text-xs text-white/50">
      Posts: <span class="text-white/80">{{ postCount }}</span>
      <span v-if="feed.loading" class="ml-2 text-yellow-400">Loading...</span>
      <span v-if="feed.error" class="ml-2 text-red-400">Error: {{ feed.error }}</span>
    </div>

    <PostList :posts="posts" @like="feed.toggleLike" @delete="handleDelete" />
  </section>
</template>

<script setup>
import { computed, watch, onMounted } from "vue"
import { useFeedStore } from "../stores/useFeedStore"
import { useAuthStore } from "../stores/useAuthStore"
import { useGamesStore } from "../stores/useGamesStore"
import { useUiStore } from "../stores/useUiStore"

import PostComposer from "../components/feed/PostComposer.vue"
import PostList from "../components/feed/PostList.vue"

const feed = useFeedStore()
const auth = useAuthStore()
const games = useGamesStore()
const ui = useUiStore()

const posts = computed(() => feed.posts)
const postCount = computed(() => feed.postCount)

// Load posts from the API as soon as the page mounts
onMounted(() => {
  feed.fetchPosts()
})

async function handleSubmit({ author, game, content }) {
  try {
    await feed.addPost({
      content,
      userId: 1,
      gameId: 1,
      author: author || auth.user.name,
      game: game || "BG3",
    })
    ui.showToast("Posted ✅")
  } catch (err) {
    ui.showToast(`Failed: ${err.message}`)
  }
}

async function handleDelete(id) {
  try {
    await feed.deletePost(id)
    ui.showToast("Deleted 🗑️")
  } catch (err) {
    ui.showToast(`Failed: ${err.message}`)
  }
}

watch(
  () => feed.posts.length,
  (n, o) => {
    if (n > o) ui.setLoading(false)
  },
)
</script>
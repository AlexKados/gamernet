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
    </div>

    <PostList :posts="posts" @like="feed.toggleLike" @delete="feed.deletePost" />
  </section>
</template>

<script setup>
import { computed, watch } from "vue"
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
const nextId = computed(() => {
  const maxId = feed.posts.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0)
  return maxId + 1
})

function handleSubmit({ author, game, content }) {
  const post = {
    id: nextId.value,
    author: author || auth.user.name,
    createdAt: "just now",
    game: game || "BG3",
    content,
    liked: false,
    likes: 0,
  }

  feed.addPost(post)
  ui.showToast("Posted ✅")
}

watch(
  () => feed.posts.length,
  (n, o) => {
    if (n > o) ui.setLoading(false)
  },
)
</script>

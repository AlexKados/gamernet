<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold">Home</h1>
      <p class="text-white/80">Welcome to GamerNet 🎮</p>
    </header>

    <PostComposer @create="addPost" />

    <PostList
      :posts="posts"
      @like="toggleLike"
      @delete="deletePost"
    />
  </section>
</template>

<script setup>
import { ref } from "vue"
import PostComposer from "../components/feed/PostComposer.vue"
import PostList from "../components/feed/PostList.vue"

const posts = ref([
  {
    id: 1,
    author: "Alex",
    game: "Baldur’s Gate 3",
    content: "Just discovered a new build and it’s absolutely broken 😭",
    liked: false,
    likes: 12,
    createdAt: "just now",
  },
  {
    id: 2,
    author: "Sofi",
    game: "Pathfinder: WotR",
    content: "My paladin is one bad dialogue choice away from chaos.",
    liked: true,
    likes: 41,
    createdAt: "2h ago",
  },
])

function addPost(payload) {
  const newPost = {
    id: Date.now(),
    author: payload.author,
    game: payload.game,
    content: payload.content,
    liked: false,
    likes: 0,
    createdAt: "just now",
  }
  posts.value = [newPost, ...posts.value]
}

function toggleLike(postId) {
  posts.value = posts.value.map((p) => {
    if (p.id !== postId) return p
    const liked = !p.liked
    const likes = liked ? p.likes + 1 : Math.max(0, p.likes - 1)
    return { ...p, liked, likes }
  })
}

function deletePost(postId) {
  posts.value = posts.value.filter((p) => p.id !== postId)
}
</script>

<template>
  <article class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
    <header class="flex items-start justify-between gap-4">
      <div>
        <p class="font-semibold">
          {{ post.author }}
          <span class="text-white/50 font-normal">· {{ post.createdAt }}</span>
        </p>
        <p class="text-sm text-white/70">Playing: <span class="text-white">{{ post.game }}</span></p>
      </div>

      <BaseButton @click="$emit('delete')" class="!px-2 !py-1 text-white/70 hover:text-white">
        ✖
      </BaseButton>
    </header>

    <p class="text-white/90">{{ post.content }}</p>

    <footer class="flex items-center justify-between">
      <LikeButton :liked="post.liked" :likes="post.likes" @toggle="$emit('like')" />
      <span class="text-xs text-white/50">id: {{ post.id }}</span>
    </footer>
  </article>
</template>

<script setup>
import BaseButton from "../ui/BaseButton.vue"
import LikeButton from "./LikeButton.vue"

defineProps({
  post: { type: Object, required: true },
})
defineEmits(["like", "delete"])
</script>

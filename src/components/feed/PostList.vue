<template>
  <section class="space-y-4">
    <PostCard
      v-for="p in posts"
      :key="p.id"
      :post="p"
      @like="$emit('like', p.id)"
      @delete="$emit('delete', p.id)"
    />
  </section>
</template>

<script setup>
import PostCard from "./PostCard.vue"

defineProps({
  posts: { type: Array, required: true },
})
defineEmits(["like", "delete"])
</script>

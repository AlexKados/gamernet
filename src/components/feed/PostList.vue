<template>
  <div class="space-y-3">
    <PostCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @like="$emit('like', post.id)"
      @delete="$emit('delete', post.id)"
    />
  </div>
</template>

<script setup>
import PostCard from "./PostCard.vue";

defineProps({
  posts: { type: Array, required: true },
});
defineEmits(["like", "delete"]);
</script>

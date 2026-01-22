<template>
  <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
    <StatCard label="Posts" :value="stats.posts" />
    <StatCard label="Followers" :value="stats.followers" />
    <StatCard label="Following" :value="stats.following" />
    <StatCard label="Likes" :value="stats.likes" />
  </div>
</template>

<script setup>
import StatCard from "./StatCard.vue";

defineProps({
  stats: { type: Object, required: true },
});
</script>

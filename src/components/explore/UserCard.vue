<template>
  <article
    class="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start justify-between gap-4"
  >
    <div class="space-y-1">
      <p class="font-semibold">{{ user.name }}</p>
      <p class="text-sm text-white/70">{{ user.bio }}</p>
      <div class="flex flex-wrap gap-2 pt-2">
        <span
          v-for="tag in user.tags"
          :key="tag"
          class="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <BaseButton @click="$emit('toggle-follow', user.id)">
      {{ user.following ? "Unfollow" : "Follow" }}
    </BaseButton>
  </article>
</template>

<script setup>
import BaseButton from "../ui/BaseButton.vue";

defineProps({
  user: { type: Object, required: true },
});
defineEmits(["toggle-follow"]);
</script>

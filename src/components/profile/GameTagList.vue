<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="g in games"
      :key="g"
      class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
    >
      {{ g }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  games: { type: Array, required: true },
})
</script>

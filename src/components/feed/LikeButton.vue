<template>
  <button
    class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm
           border border-white/10 hover:bg-white/10"
    :class="liked ? 'bg-white/10' : 'bg-transparent'"
    @click="$emit('toggle')"
  >
    <span>{{ liked ? "❤️" : "🤍" }}</span>
    <span class="text-white/80">{{ likes }}</span>
  </button>
</template>

<script setup>
defineProps({
  liked: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
})
defineEmits(["toggle"])
</script>

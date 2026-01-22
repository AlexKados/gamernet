<template>
  <div class="rounded-xl border border-white/10 bg-white/5 p-4">
    <div class="text-sm text-white/60">{{ label }}</div>
    <div class="mt-1 text-2xl font-bold text-white/90">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
})
</script>

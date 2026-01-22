<template>
  <div class="space-y-2 text-white/80">
    <p class="leading-relaxed">{{ bio }}</p>
    <div class="text-sm text-white/60">
      Location: <span class="text-white/80">{{ location }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bio: { type: String, required: true },
  location: { type: String, required: true },
});
</script>

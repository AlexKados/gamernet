<template>
  <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white/90">{{ title }}</h2>
      <slot name="actions" />
    </div>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
});
</script>

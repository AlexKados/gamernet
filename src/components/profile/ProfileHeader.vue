<template>
  <div class="flex items-center gap-4">
    <div
      class="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl font-bold text-white/90"
      :title="user.name"
    >
      {{ initials }}
    </div>

    <div class="flex-1">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold text-white/90">{{ user.name }}</h1>
        <span
          class="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70"
        >
          @{{ user.handle }}
        </span>
      </div>
      <p class="mt-1 text-white/60">{{ user.tagline }}</p>
    </div>

    <button
      class="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15"
      @click="$emit('edit')"
    >
      Edit profile
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

defineEmits(["edit"]);

const initials = computed(() => {
  const parts = (props.user.name || "").trim().split(/\s+/);
  return (
    parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "GN"
  );
});

import { computed } from "vue";
</script>

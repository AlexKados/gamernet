<template>
  <button
    class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium
           bg-white/10 text-white hover:bg-white/20 active:bg-white/25
           disabled:opacity-50 disabled:cursor-not-allowed"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: "button" },
  disabled: { type: Boolean, default: false },
})
defineEmits(["click"])
</script>

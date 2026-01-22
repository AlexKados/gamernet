<template>
  <div class="pointer-events-none fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
    <transition name="fade">
      <div
        v-if="ui.hasToast"
        class="pointer-events-auto rounded-xl border border-white/10 bg-black/70 px-4 py-2 text-sm text-white shadow-lg backdrop-blur"
      >
        {{ ui.toast }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useUiStore } from "../../stores/useUiStore"

const ui = useUiStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

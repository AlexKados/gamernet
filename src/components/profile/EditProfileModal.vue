<template>
  <div class="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
    <div class="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950 p-5">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white/90">Edit profile</h3>
        <button
          class="rounded-lg bg-white/10 px-3 py-1 text-sm text-white/80 hover:bg-white/15"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>

      <EditProfileForm
        :initial="initial"
        @submit="(payload) => $emit('save', payload)"
        @cancel="$emit('close')"
      />
    </div>
  </div>
</template>

<script setup>
import EditProfileForm from "./EditProfileForm.vue"

defineProps({
  initial: { type: Object, required: true },
})

defineEmits(["close", "save"])
</script>

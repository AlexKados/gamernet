<template>
  <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div class="grid gap-3 md:grid-cols-2">
      <BaseInput v-model="author" :placeholder="`Your name (ex: ${defaultAuthor})`" />
      <select
        v-model="game"
        class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
      >
        <option value="">Choose a game</option>
        <option v-for="g in games" :key="g" :value="g">
          {{ g }}
        </option>
      </select>
    </div>

    <textarea
      v-model="content"
      class="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
      rows="3"
      placeholder="What are you playing / thinking?"
    />

    <div class="mt-3 flex items-center justify-between">
      <p class="text-xs text-white/50">{{ content.length }}/220</p>

      <BaseButton :disabled="!canPost" @click="submit"> Post </BaseButton>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import BaseButton from "../ui/BaseButton.vue"
import BaseInput from "../ui/BaseInput.vue"

const props = defineProps({
  defaultAuthor: { type: String, default: "Player" },
  games: { type: Array, default: () => [] },
})
const emit = defineEmits(["submit"])

const author = ref("")
const game = ref("")
const content = ref("")

const canPost = computed(() => {
  const textOk = content.value.trim().length >= 3 && content.value.trim().length <= 220
  return textOk
})

watch(content, (v) => {
  if (v.length > 220) content.value = v.slice(0, 220)
})

function submit() {
  if (!canPost.value) return

  emit("submit", {
    author: author.value.trim() || props.defaultAuthor,
    game: game.value || props.games[0] || "BG3",
    content: content.value.trim(),
  })

  content.value = ""
}
</script>

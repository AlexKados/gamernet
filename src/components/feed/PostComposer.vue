<template>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <BaseInput v-model="author" placeholder="Your name (ex: Alex)" />
      <BaseInput v-model="game" placeholder="Game (ex: BG3, LoL, Valorant)" />
    </div>

    <BaseInput
      v-model="content"
      placeholder="What are you playing / thinking?"
    />

    <div class="flex items-center justify-end gap-2">
      <span class="text-xs text-white/50" v-if="content.length">
        {{ content.length }}/180
      </span>

      <BaseButton :disabled="!canPost" @click="submit"> Post </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import BaseInput from "../ui/BaseInput.vue";

const emit = defineEmits(["create"]);

const author = ref("");
const game = ref("");
const content = ref("");

const canPost = computed(() => {
  return (
    author.value.trim() &&
    game.value.trim() &&
    content.value.trim() &&
    content.value.length <= 180
  );
});

function submit() {
  if (!canPost.value) return;
  emit("create", {
    author: author.value.trim(),
    game: game.value.trim(),
    content: content.value.trim(),
  });
  content.value = "";
}
</script>

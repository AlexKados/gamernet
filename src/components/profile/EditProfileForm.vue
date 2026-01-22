<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div class="grid gap-3 md:grid-cols-2">
      <label class="block">
        <div class="mb-1 text-sm text-white/70">Name</div>
        <input
          v-model="form.name"
          class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 outline-none focus:border-white/20"
        />
      </label>

      <label class="block">
        <div class="mb-1 text-sm text-white/70">Handle</div>
        <input
          v-model="form.handle"
          class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 outline-none focus:border-white/20"
        />
      </label>
    </div>

    <label class="block">
      <div class="mb-1 text-sm text-white/70">Tagline</div>
      <input
        v-model="form.tagline"
        class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 outline-none focus:border-white/20"
      />
    </label>

    <label class="block">
      <div class="mb-1 text-sm text-white/70">Bio</div>
      <textarea
        v-model="form.bio"
        rows="3"
        class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 outline-none focus:border-white/20"
      ></textarea>
    </label>

    <div class="grid gap-3 md:grid-cols-2">
      <label class="block">
        <div class="mb-1 text-sm text-white/70">Location</div>
        <input
          v-model="form.location"
          class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 outline-none focus:border-white/20"
        />
      </label>

      <label class="block">
        <div class="mb-1 text-sm text-white/70">Favorite games (comma separated)</div>
        <input
          v-model="gamesText"
          class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/90 outline-none focus:border-white/20"
        />
      </label>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <button
        type="button"
        class="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="rounded-xl bg-indigo-500/30 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-indigo-500/40"
      >
        Save
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, watch } from "vue"

const props = defineProps({
  initial: { type: Object, required: true },
})

const emit = defineEmits(["submit", "cancel"])

const form = reactive({
  name: "",
  handle: "",
  tagline: "",
  bio: "",
  location: "",
  games: [],
})

const gamesText = ref("")

watch(
  () => props.initial,
  (v) => {
    form.name = v.name || ""
    form.handle = v.handle || ""
    form.tagline = v.tagline || ""
    form.bio = v.bio || ""
    form.location = v.location || ""
    form.games = Array.isArray(v.games) ? v.games : []
    gamesText.value = form.games.join(", ")
  },
  { immediate: true },
)

function submit() {
  const games = gamesText.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  emit("submit", {
    ...form,
    games,
  })
}
</script>

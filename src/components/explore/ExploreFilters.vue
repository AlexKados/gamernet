<template>
  <div class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
    <h2 class="text-lg font-semibold">Find players</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <BaseInput v-model="localQuery" placeholder="Search name or bio..." />
      <SelectInput v-model="localGame">
        <option value="">All games</option>
        <option v-for="g in games" :key="g" :value="g">{{ g }}</option>
      </SelectInput>
    </div>

    <div class="flex justify-end">
      <BaseButton @click="emitFilters">Apply</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import BaseButton from "../ui/BaseButton.vue"
import BaseInput from "../ui/BaseInput.vue"
import SelectInput from "../ui/SelectInput.vue"

const props = defineProps({
  games: { type: Array, required: true },
  query: { type: String, default: "" },
  game: { type: String, default: "" },
})

const emit = defineEmits(["update"])

const localQuery = ref(props.query)
const localGame = ref(props.game)

function emitFilters() {
  emit("update", { query: localQuery.value, game: localGame.value })
}
</script>

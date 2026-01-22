<template>
  <div class="space-y-3">
    <UserCard
      v-for="u in users"
      :key="u.id"
      :user="u"
      @toggle-follow="$emit('toggle-follow', $event)"
    />
  </div>
</template>

<script setup>
import UserCard from "./UserCard.vue"

defineProps({
  users: { type: Array, required: true },
})
defineEmits(["toggle-follow"])
</script>

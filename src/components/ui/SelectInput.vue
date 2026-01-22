<template>
  <select
    class="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white
           focus:outline-none focus:ring-2 focus:ring-white/20"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <slot />
  </select>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: "" },
})
defineEmits(["update:modelValue"])
</script>

<style scoped>
select option {
  background-color: #0b1220; 
  color: #ffffff;            
}
</style>

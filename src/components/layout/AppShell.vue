<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <Navbar />

    <main class="mx-auto max-w-6xl px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from "./Navbar.vue";
</script>

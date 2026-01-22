<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-slate-950 to-gray-950 text-white">
    <Navbar />

    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>

    <ToastBar />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router"
import Navbar from "./components/layout/Navbar.vue"
import ToastBar from "./components/ui/ToastBar.vue"
</script>

<template>
  <div class="mx-auto max-w-md space-y-6">
    <div class="space-y-1 text-center">
      <h1 class="text-3xl font-bold text-white/90">
        {{ mode === "login" ? "Welcome back" : "Join GamerNet" }}
      </h1>
      <p class="text-white/60">
        {{ mode === "login" ? "Sign in to your account" : "Create a new account" }}
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      <!-- Username -->
      <div class="space-y-1">
        <label class="text-sm text-white/70">Username</label>
        <BaseInput v-model="username" placeholder="e.g. alex" />
      </div>

      <!-- Email (register only) -->
      <div v-if="mode === 'register'" class="space-y-1">
        <label class="text-sm text-white/70">Email</label>
        <BaseInput v-model="email" type="email" placeholder="you@example.com" />
      </div>

      <!-- Display name (register only) -->
      <div v-if="mode === 'register'" class="space-y-1">
        <label class="text-sm text-white/70">Display name</label>
        <BaseInput v-model="displayName" placeholder="How others see you" />
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <label class="text-sm text-white/70">Password</label>
        <BaseInput v-model="password" type="password" placeholder="••••••••" />
      </div>

      <!-- Error message -->
      <p v-if="error" class="text-sm text-red-400">{{ error }}</p>

      <!-- Submit -->
      <BaseButton
        class="w-full bg-indigo-500/80 hover:bg-indigo-500"
        :disabled="loading"
        @click="handleSubmit"
      >
        {{ loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account" }}
      </BaseButton>

      <!-- Toggle mode -->
      <p class="text-center text-sm text-white/50">
        {{ mode === "login" ? "No account yet?" : "Already have an account?" }}
        <button class="text-indigo-300 hover:underline" @click="toggleMode">
          {{ mode === "login" ? "Register" : "Log in" }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/useAuthStore"
import { useUiStore } from "../stores/useUiStore"
import BaseInput from "../components/ui/BaseInput.vue"
import BaseButton from "../components/ui/BaseButton.vue"

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const mode = ref("login")
const username = ref("")
const email = ref("")
const displayName = ref("")
const password = ref("")
const error = ref("")
const loading = ref(false)

function toggleMode() {
  mode.value = mode.value === "login" ? "register" : "login"
  error.value = ""
}

async function handleSubmit() {
  error.value = ""
  if (!username.value || !password.value) {
    error.value = "Username and password are required."
    return
  }
  loading.value = true
  try {
    if (mode.value === "login") {
      await auth.login({ username: username.value, password: password.value })
      ui.showToast(`Welcome back, ${auth.displayName}!`)
    } else {
      await auth.register({
        username: username.value,
        email: email.value,
        password: password.value,
        displayName: displayName.value,
      })
      ui.showToast("Account created! You're logged in.")
    }
    router.push("/")
  } catch (err) {
    error.value = err.message || "Something went wrong."
  } finally {
    loading.value = false
  }
}
</script>
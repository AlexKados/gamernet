import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: { id: 99, name: "Alex", handle: "alexk", status: "online" },
    isLoggedIn: true,
  }),
  getters: {
    displayName: (s) => `${s.user.name} (@${s.user.handle})`,
    userId: (s) => s.user.id,
  },
  actions: {
    login(handle) {
      this.user.handle = handle || this.user.handle
      this.isLoggedIn = true
    },
    logout() {
      this.isLoggedIn = false
    },
  },
})

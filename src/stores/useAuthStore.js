import { defineStore } from "pinia"
import { api, setTokens, clearTokens, getAccessToken } from "../services/api"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isLoggedIn: !!getAccessToken(),
  }),
  getters: {
    displayName: (s) => (s.user ? `${s.user.username}` : "Guest"),
    userId: (s) => (s.user ? s.user.id : null),
  },
  actions: {
    async register({ username, email, password, displayName }) {
      // Create the account, then log in automatically
      await api.post("/auth/register", { username, email, password, displayName })
      return this.login({ username, password })
    },

    async login({ username, password }) {
      const data = await api.post("/auth/login", { username, password })
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
      this.user = data.user
      this.isLoggedIn = true
      return data.user
    },

    async logout() {
      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          await api.post("/auth/logout", { refreshToken })
        }
      } catch {
        // ignore network errors on logout
      }
      clearTokens()
      this.user = null
      this.isLoggedIn = false
    },
  },
})
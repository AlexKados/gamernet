import { defineStore } from "pinia"
import { api } from "../services/api"

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: null,
    loading: false,
    error: null,
  }),
  getters: {
    hasProfile: (s) => Boolean(s.profile),
    profileName: (s) => s.profile?.displayName || "Guest",
  },
  actions: {
    async fetchMyProfile() {
      this.loading = true
      this.error = null
      try {
        this.profile = await api.get("/profiles/me")
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async updateMyProfile(payload) {
      try {
        this.profile = await api.put("/profiles/me", payload)
        return this.profile
      } catch (err) {
        this.error = err.message
        throw err
      }
    },
  },
})
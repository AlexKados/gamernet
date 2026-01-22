import { defineStore } from "pinia"

export const useUiStore = defineStore("ui", {
  state: () => ({
    toast: "",
    loading: false,
  }),
  getters: {
    hasToast: (s) => Boolean(s.toast),
    isLoading: (s) => s.loading,
  },
  actions: {
    showToast(msg) {
      this.toast = msg
      setTimeout(() => (this.toast = ""), 2000)
    },
    setLoading(v) {
      this.loading = v
    },
  },
})

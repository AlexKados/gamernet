import { defineStore } from "pinia"

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [
      { id: 1, name: "Nina", bio: "Healer main.", tags: ["BG3"], following: false },
      { id: 2, name: "Tom", bio: "Ranked grinder.", tags: ["LoL"], following: true },
    ],
  }),
  getters: {
    userCount: (s) => s.users.length,
    followingCount: (s) => s.users.filter((u) => u.following).length,
    getUserById: (s) => (id) => s.users.find((u) => String(u.id) === String(id)),
  },
  actions: {
    toggleFollow(userId) {
      this.users = this.users.map((u) =>
        u.id === userId ? { ...u, following: !u.following } : u,
      )
    },
    setUsers(list) {
      this.users = list
    },
  },
})

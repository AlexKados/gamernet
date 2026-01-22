import { defineStore } from "pinia"

export const useFeedStore = defineStore("feed", {
  state: () => ({
    posts: [
      {
        id: 1,
        author: "Nina",
        createdAt: "now",
        game: "BG3",
        content: "Who wants co-op tonight?",
        liked: false,
        likes: 3,
      },
    ],
  }),
  getters: {
    postCount: (s) => s.posts.length,
    getPostById: (s) => (id) => s.posts.find((p) => String(p.id) === String(id)),
  },
  actions: {
    addPost(post) {
      this.posts = [post, ...this.posts]
    },
    toggleLike(id) {
      this.posts = this.posts.map((p) => {
        if (p.id !== id) return p
        const nextLiked = !p.liked
        return { ...p, liked: nextLiked, likes: p.likes + (nextLiked ? 1 : -1) }
      })
    },
    deletePost(id) {
      this.posts = this.posts.filter((p) => p.id !== id)
    },
  },
})

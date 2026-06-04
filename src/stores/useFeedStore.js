import { defineStore } from "pinia"
import { api } from "../services/api"

export const useFeedStore = defineStore("feed", {
  state: () => ({
    posts: [],
    loading: false,
    error: null,
  }),
  getters: {
    postCount: (s) => s.posts.length,
    getPostById: (s) => (id) => s.posts.find((p) => String(p.id) === String(id)),
  },
  actions: {
    // ─── GET /api/posts ─────────────────────────────────────
    async fetchPosts() {
      this.loading = true
      this.error = null
      try {
        const data = await api.get("/posts")
        // Map API response to UI shape
        this.posts = data.map((p) => ({
          id: p.id,
          author: p.User?.username || "unknown",
          createdAt: new Date(p.createdAt).toLocaleString(),
          game: p.Game?.name || "Unknown game",
          content: p.content,
          liked: false,
          likes: p.likesCount || 0,
          userId: p.userId,
          gameId: p.gameId,
        }))
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // ─── POST /api/posts ────────────────────────────────────
    async addPost({ content, userId, gameId, author, game }) {
      try {
        const newPost = await api.post("/posts", { content, userId, gameId })
        // Optimistically add to local state with the same shape
        this.posts = [
          {
            id: newPost.id,
            author: author || "you",
            createdAt: "just now",
            game: game || "Unknown game",
            content: newPost.content,
            liked: false,
            likes: 0,
            userId: newPost.userId,
            gameId: newPost.gameId,
          },
          ...this.posts,
        ]
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    // ─── DELETE /api/posts/:id ──────────────────────────────
    async deletePost(id) {
      try {
        await api.delete(`/posts/${id}`)
        this.posts = this.posts.filter((p) => p.id !== id)
      } catch (err) {
        this.error = err.message
        throw err
      }
    },

    toggleLike(id) {
      this.posts = this.posts.map((p) => {
        if (p.id !== id) return p
        const nextLiked = !p.liked
        return { ...p, liked: nextLiked, likes: p.likes + (nextLiked ? 1 : -1) }
      })
    },
  },
})
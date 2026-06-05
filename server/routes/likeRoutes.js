import express from "express"
import { Like, Post } from "../models/index.js"

const router = express.Router()

// ─── POST /api/likes — toggle like (emits WebSocket event) ────
router.post("/", async (req, res) => {
  try {
    const { userId, postId } = req.body

    const existing = await Like.findOne({ where: { userId, postId } })
    const post = await Post.findByPk(postId)
    if (!post) return res.status(404).json({ error: "Post not found" })

    let liked
    if (existing) {
      // Already liked → unlike
      await existing.destroy()
      post.likesCount = Math.max(0, post.likesCount - 1)
      liked = false
    } else {
      // Not liked → like
      await Like.create({ userId, postId })
      post.likesCount = post.likesCount + 1
      liked = true
    }
    await post.save()

    // Broadcast the new like count to all connected clients
    const io = req.app.get("io")
    io.emit("post:liked", { postId: post.id, likesCount: post.likesCount })

    res.json({ liked, likesCount: post.likesCount })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const like = await Like.findByPk(req.params.id)
    if (!like) return res.status(404).json({ error: "Like not found" })
    await like.update(req.body)
    res.json(like)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
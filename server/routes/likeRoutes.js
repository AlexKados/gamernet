import express from "express"
import { Like, Post } from "../models/index.js"

const router = express.Router()

// ─── POST /api/likes — toggle like (like if not liked, unlike if liked) ───
router.post("/", async (req, res) => {
  try {
    const { userId, postId } = req.body

    // Check if this user has already liked this post
    const existing = await Like.findOne({ where: { userId, postId } })

    if (existing) {
      // Already liked → unlike (delete it)
      await existing.destroy()

      // Decrement the post's likesCount
      const post = await Post.findByPk(postId)
      if (post) {
        post.likesCount = Math.max(0, post.likesCount - 1)
        await post.save()
      }

      return res.json({ liked: false, message: "Unliked" })
    }

    // Not liked yet → create the like
    await Like.create({ userId, postId })

    // Increment the post's likesCount
    const post = await Post.findByPk(postId)
    if (post) {
      post.likesCount = post.likesCount + 1
      await post.save()
    }

    res.status(201).json({ liked: true, message: "Liked" })
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
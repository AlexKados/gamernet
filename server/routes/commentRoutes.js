import express from "express"
import { User, Comment } from "../models/index.js"

const router = express.Router()

// ─── POST /api/comments — create a comment ────────────────────
router.post("/", async (req, res) => {
  try {
    const { content, userId, postId } = req.body
    const comment = await Comment.create({ content, userId, postId })
    res.status(201).json(comment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ─── PUT /api/comments/:id — update a comment ─────────────────
router.put("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id)
    if (!comment) return res.status(404).json({ error: "Comment not found" })
    await comment.update(req.body)
    res.json(comment)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ─── DELETE /api/comments/:id — delete a comment ──────────────
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id)
    if (!comment) return res.status(404).json({ error: "Comment not found" })
    await comment.destroy()
    res.json({ message: "Comment deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
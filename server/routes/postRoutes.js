import express from "express"
import { User, Post, Game, Comment } from "../models/index.js"

const router = express.Router()

// ─── GET /api/posts — list all posts with author + game ───────
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Game, attributes: ["id", "name", "genre"] },
      ],
      order: [["createdAt", "DESC"]],
    })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── GET /api/posts/:id — one post with comments + author + game
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Game, attributes: ["id", "name", "genre"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "username"] }],
        },
      ],
    })
    if (!post) return res.status(404).json({ error: "Post not found" })
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── GET /api/posts/:id/comments — comments for a post ────────
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.id },
      include: [{ model: User, attributes: ["id", "username"] }],
      order: [["createdAt", "ASC"]],
    })
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── POST /api/posts — create a post (emits WebSocket event) ──
router.post("/", async (req, res) => {
  try {
    const { content, userId, gameId } = req.body
    const post = await Post.create({ content, userId, gameId })

    // Re-fetch with author + game so the live update has full data
    const fullPost = await Post.findByPk(post.id, {
      include: [
        { model: User, attributes: ["id", "username"] },
        { model: Game, attributes: ["id", "name", "genre"] },
      ],
    })

    // Broadcast to all connected clients in real time
    const io = req.app.get("io")
    io.emit("post:created", fullPost)

    res.status(201).json(fullPost)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ─── PUT /api/posts/:id — update a post ───────────────────────
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })
    await post.update(req.body)
    res.json(post)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ─── DELETE /api/posts/:id — delete a post ────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id)
    if (!post) return res.status(404).json({ error: "Post not found" })
    await post.destroy()
    res.json({ message: "Post deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
import express from "express"
import { Game, Post } from "../models/index.js"

const router = express.Router()

// ─── GET /api/games — list all games ──────────────────────────
router.get("/", async (req, res) => {
  try {
    const games = await Game.findAll({ order: [["name", "ASC"]] })
    res.json(games)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── GET /api/games/:id — one game with its posts ─────────────
router.get("/:id", async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [{ model: Post }],
    })
    if (!game) return res.status(404).json({ error: "Game not found" })
    res.json(game)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── POST /api/games — create a game ──────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, genre, coverUrl } = req.body
    const game = await Game.create({ name, genre, coverUrl })
    res.status(201).json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ─── PUT /api/games/:id — update a game ───────────────────────
router.put("/:id", async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id)
    if (!game) return res.status(404).json({ error: "Game not found" })
    await game.update(req.body)
    res.json(game)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
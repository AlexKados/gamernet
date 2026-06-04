import express from "express"
import { sequelize, User, Profile } from "../models/index.js"

const router = express.Router()

// ─── GET /api/users — list all users + their profiles ─────────
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({ include: Profile })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── GET /api/users/:id — one user with profile ───────────────
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Profile })
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── POST /api/users — create user + profile (TRANSACTION) ────
router.post("/", async (req, res) => {
  const { username, email, displayName, tagline, bio, location } = req.body

  const t = await sequelize.transaction()
  try {
    const user = await User.create(
      { username, email },
      { transaction: t }
    )

    await Profile.create(
      {
        userId: user.id,
        displayName: displayName || username,
        tagline,
        bio,
        location,
      },
      { transaction: t }
    )

    await t.commit()

    const fullUser = await User.findByPk(user.id, { include: Profile })
    res.status(201).json(fullUser)
  } catch (error) {
    await t.rollback()
    res.status(400).json({ error: error.message })
  }
})

// ─── PUT /api/users/:id — update user ─────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    await user.update(req.body)
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ─── DELETE /api/users/:id — delete user (CASCADE handles rest) 
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    await user.destroy()
    res.json({ message: "User deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
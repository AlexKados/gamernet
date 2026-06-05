import express from "express"
import { Profile, User } from "../models/index.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// ─── GET /api/profiles/me — the logged-in user's profile ──────
router.get("/me", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ["id", "username"] }],
    })
    if (!profile) return res.status(404).json({ error: "Profile not found" })
    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── PUT /api/profiles/me — update logged-in user's profile ───
router.put("/me", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } })
    if (!profile) return res.status(404).json({ error: "Profile not found" })

    // Only allow editing these fields
    const { displayName, tagline, bio, location } = req.body
    await profile.update({ displayName, tagline, bio, location })
    res.json(profile)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ─── PUT /api/profiles/:id — update a profile by id (kept) ────
router.put("/:id", async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id)
    if (!profile) return res.status(404).json({ error: "Profile not found" })
    await profile.update(req.body)
    res.json(profile)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
import express from "express"
import { Profile, User } from "../models/index.js"

const router = express.Router()

// ─── PUT /api/profiles/:id — update a profile ─────────────────
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
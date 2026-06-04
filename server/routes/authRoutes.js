import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sequelize, User, Profile } from "../models/index.js"
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_SECRET,
} from "../middleware/auth.js"

const router = express.Router()

// ─── POST /api/auth/register — create account (hash pw + profile, TX) ───
router.post("/register", async (req, res) => {
  const { username, email, password, displayName } = req.body

  const t = await sequelize.transaction()
  try {
    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create(
      { username, email, password: hashed },
      { transaction: t }
    )

    await Profile.create(
      { userId: user.id, displayName: displayName || username },
      { transaction: t }
    )

    await t.commit()
    res.status(201).json({ id: user.id, username: user.username })
  } catch (error) {
    await t.rollback()
    res.status(400).json({ error: error.message })
  }
})

// ─── POST /api/auth/login — verify pw, issue access + refresh ───
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ where: { username } })
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: "Invalid credentials" })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store the refresh token server-side so we can validate/revoke it
    user.refreshToken = refreshToken
    await user.save()

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── POST /api/auth/refresh — trade refresh token for new access token ───
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ error: "No refresh token" })

    // Verify signature + expiry
    let payload
    try {
      payload = jwt.verify(refreshToken, REFRESH_SECRET)
    } catch {
      return res.status(403).json({ error: "Invalid refresh token" })
    }

    // Make sure it matches the one we stored (not revoked)
    const user = await User.findByPk(payload.id)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Refresh token revoked" })
    }

    const accessToken = generateAccessToken(user)
    res.json({ accessToken })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ─── POST /api/auth/logout — revoke refresh token ───
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body
    const user = await User.findOne({ where: { refreshToken } })
    if (user) {
      user.refreshToken = null
      await user.save()
    }
    res.json({ message: "Logged out" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
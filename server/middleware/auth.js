import jwt from "jsonwebtoken"

// Secrets — in a real app these live in environment variables (.env).
// Hardcoded here for the school project demo.
export const ACCESS_SECRET = "gamernet_access_secret_change_me"
export const REFRESH_SECRET = "gamernet_refresh_secret_change_me"

// Access token: short-lived (15 min)
export function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  )
}

// Refresh token: long-lived (7 days)
export function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  )
}

// Middleware: protect routes. Reads "Authorization: Bearer <token>",
// verifies the access token, attaches req.user, or rejects with 401.
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const payload = jwt.verify(token, ACCESS_SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" })
  }
}
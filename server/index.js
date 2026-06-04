import express from "express"
import cors from "cors"
import { sequelize } from "./models/index.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import gameRoutes from "./routes/gameRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import likeRoutes from "./routes/likeRoutes.js"
import authRoutes from "./routes/authRoutes.js"


const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

app.get("/debug/profiles", async (req, res) => {
  const profiles = await sequelize.models.Profile.findAll()
  res.json(profiles)
})

app.get("/debug/tables", async (req, res) => {
  const [results] = await sequelize.query(
    "SELECT name FROM sqlite_master WHERE type='table'"
  )
  res.json(results)
})

// API routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/games", gameRoutes)
app.use("/api/profiles", profileRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/auth", authRoutes)


// Hello world
app.get("/", (req, res) => {
  res.json({ message: "GamerNet API is running 🎮🔥" })
})

// Start
async function start() {
  try {
    await sequelize.authenticate()
    console.log("✅ Database connection established")

    await sequelize.sync()
    console.log("✅ Database synced (tables updated)")

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Startup failed:", error)
    process.exit(1)
  }
}

start()
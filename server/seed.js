import bcrypt from "bcryptjs"
import { sequelize, User, Profile, Game, Post, Comment, Like } from "./models/index.js"

async function seed() {
  try {
    await sequelize.sync({ force: true })
    console.log("🧹 Tables wiped + recreated")

    // ─── USERS ─────────────────────────────────────────────────
    const pw = await bcrypt.hash("demo123", 10)
    const alex = await User.create({ username: "alex", email: "alex@gamernet.com", password: pw })
    const nina = await User.create({ username: "nina", email: "nina@gamernet.com", password: pw })
    const tom = await User.create({ username: "tom", email: "tom@gamernet.com", password: pw })
    const kiki = await User.create({ username: "kiki", email: "kiki@gamernet.com", password: pw })
    console.log("👤 4 users created")

    // ─── PROFILES (one-to-one with User) ───────────────────────
    await Profile.create({
      userId: alex.id,
      displayName: "Alex K",
      tagline: "CRPG enjoyer",
      bio: "Min-max characters, then roleplay chaotically.",
      location: "Oradea, RO",
    })
    await Profile.create({
      userId: nina.id,
      displayName: "Nina",
      tagline: "Healer main",
      bio: "Co-op only. Don't make me solo queue.",
      location: "Berlin, DE",
    })
    await Profile.create({
      userId: tom.id,
      displayName: "Tom",
      tagline: "Ranked grinder",
      bio: "Jungle is life.",
      location: "Madrid, ES",
    })
    await Profile.create({
      userId: kiki.id,
      displayName: "Kiki",
      tagline: "FPS brain",
      bio: "Aim training daily.",
      location: "Tokyo, JP",
    })
    console.log("📇 4 profiles created")

    // ─── GAMES ─────────────────────────────────────────────────
    const bg3 = await Game.create({ name: "Baldur's Gate 3", genre: "CRPG" })
    const wotr = await Game.create({ name: "Pathfinder: WotR", genre: "CRPG" })
    const valorant = await Game.create({ name: "Valorant", genre: "FPS" })
    const lol = await Game.create({ name: "League of Legends", genre: "MOBA" })
    console.log("🎮 4 games created")

    // ─── POSTS (with userId + gameId foreign keys) ─────────────
    const post1 = await Post.create({
      content: "Just discovered a new build and it's broken 😭",
      userId: alex.id,
      gameId: bg3.id,
    })
    const post2 = await Post.create({
      content: "My paladin is one bad dialogue choice away from chaos.",
      userId: nina.id,
      gameId: wotr.id,
    })
    const post3 = await Post.create({
      content: "Ranked is suffering today.",
      userId: tom.id,
      gameId: lol.id,
    })
    console.log("📝 3 posts created")

    // ─── COMMENTS ──────────────────────────────────────────────
    await Comment.create({ content: "Drop the build pls!", userId: nina.id, postId: post1.id })
    await Comment.create({ content: "Lmaoo same energy.", userId: tom.id, postId: post2.id })
    await Comment.create({ content: "We've all been there.", userId: kiki.id, postId: post3.id })
    console.log("💬 3 comments created")

    // ─── LIKES ─────────────────────────────────────────────────
    await Like.create({ userId: nina.id, postId: post1.id })
    await Like.create({ userId: tom.id, postId: post1.id })
    await Like.create({ userId: kiki.id, postId: post2.id })
    console.log("❤️ 3 likes created")

    console.log("✅ Seed completed!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  }
}

seed()
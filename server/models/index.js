import sequelize from "../config/database.js"

import User from "./User.js"
import Profile from "./Profile.js"
import Game from "./Game.js"
import Post from "./Post.js"
import Comment from "./Comment.js"
import Like from "./Like.js"

// ─── ASSOCIATIONS ───────────────────────────────────────────

// User <-> Profile (one-to-one)
User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" })
Profile.belongsTo(User, { foreignKey: "userId" })

// User -> Posts (one-to-many)
User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" })
Post.belongsTo(User, { foreignKey: "userId" })

// Game -> Posts (one-to-many)
Game.hasMany(Post, { foreignKey: "gameId" })
Post.belongsTo(Game, { foreignKey: "gameId" })

// Post -> Comments (one-to-many)
Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" })
Comment.belongsTo(Post, { foreignKey: "postId" })

// User -> Comments (one-to-many)
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" })
Comment.belongsTo(User, { foreignKey: "userId" })

// Post -> Likes (one-to-many)
Post.hasMany(Like, { foreignKey: "postId", onDelete: "CASCADE" })
Like.belongsTo(Post, { foreignKey: "postId" })

// User -> Likes (one-to-many)
User.hasMany(Like, { foreignKey: "userId", onDelete: "CASCADE" })
Like.belongsTo(User, { foreignKey: "userId" })

// ─── EXPORT ─────────────────────────────────────────────────

export { sequelize, User, Profile, Game, Post, Comment, Like }
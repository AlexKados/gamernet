import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Like = sequelize.define("Like", {
  // No extra columns needed!
  // It'll just have id, createdAt, updatedAt + foreign keys (postId, userId)
})

export default Like
import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Profile = sequelize.define("Profile", {
  displayName: { type: DataTypes.STRING, allowNull: false },
  tagline: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  avatarUrl: { type: DataTypes.STRING },
})

export default Profile
import { DataTypes } from "sequelize"
import sequelize from "../config/database.js"

const Game = sequelize.define("Game", {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  genre: { type: DataTypes.STRING },
  coverUrl: { type: DataTypes.STRING },
})

export default Game
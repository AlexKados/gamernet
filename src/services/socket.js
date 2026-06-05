import { io } from "socket.io-client"

// Connect to the backend WebSocket server
export const socket = io("http://localhost:3000", {
  autoConnect: true,
})

socket.on("connect", () => {
  console.log("🔌 Connected to WebSocket:", socket.id)
})

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from WebSocket")
})
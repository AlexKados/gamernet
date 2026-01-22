import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "GamerNet",
        short_name: "GamerNet",
        description: "A social networking app for gamers",
        theme_color: "#0b1220",
        background_color: "#0b1220",
        display: "standalone",
        scope: "/gamernet/",
        start_url: "/gamernet/",
        icons: [
          {
            src: "/gamernet/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/gamernet/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/gamernet/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  base: "/gamernet/",
})

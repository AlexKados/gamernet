import { defineStore } from "pinia"

export const useGamesStore = defineStore("games", {
  state: () => ({
    games: ["BG3", "LoL", "Valorant", "Pathfinder: WotR", "CS2", "Fortnite"],
    selectedGame: "",
  }),
  getters: {
    gameCount: (s) => s.games.length,
    hasSelection: (s) => Boolean(s.selectedGame),
  },
  actions: {
    selectGame(game) {
      this.selectedGame = game
    },
    clearSelection() {
      this.selectedGame = ""
    },
  },
})

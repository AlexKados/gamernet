import { describe, it, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useGamesStore } from "../stores/useGamesStore"

describe("useGamesStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("has the default game list", () => {
    const games = useGamesStore()
    expect(games.gameCount).toBe(6)
    expect(games.games).toContain("BG3")
  })

  it("starts with no selection", () => {
    const games = useGamesStore()
    expect(games.selectedGame).toBe("")
    expect(games.hasSelection).toBe(false)
  })

  it("selectGame sets the selection", () => {
    const games = useGamesStore()
    games.selectGame("LoL")
    expect(games.selectedGame).toBe("LoL")
    expect(games.hasSelection).toBe(true)
  })

  it("clearSelection resets the selection", () => {
    const games = useGamesStore()
    games.selectGame("Valorant")
    games.clearSelection()
    expect(games.selectedGame).toBe("")
    expect(games.hasSelection).toBe(false)
  })
})
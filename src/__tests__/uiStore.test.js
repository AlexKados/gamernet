import { describe, it, expect, beforeEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useUiStore } from "../stores/useUiStore"

describe("useUiStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it("starts with empty toast and not loading", () => {
    const ui = useUiStore()
    expect(ui.toast).toBe("")
    expect(ui.loading).toBe(false)
    expect(ui.hasToast).toBe(false)
    expect(ui.isLoading).toBe(false)
  })

  it("showToast sets the message then clears after 2s", () => {
    const ui = useUiStore()
    ui.showToast("Hello")
    expect(ui.toast).toBe("Hello")
    expect(ui.hasToast).toBe(true)
    vi.advanceTimersByTime(2000)
    expect(ui.toast).toBe("")
    expect(ui.hasToast).toBe(false)
  })

  it("setLoading toggles loading state", () => {
    const ui = useUiStore()
    ui.setLoading(true)
    expect(ui.loading).toBe(true)
    expect(ui.isLoading).toBe(true)
    ui.setLoading(false)
    expect(ui.loading).toBe(false)
  })
})
import { describe, it, expect, beforeEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"

vi.mock("../services/api", () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

import { useProfileStore } from "../stores/useProfileStore"
import { api } from "../services/api"

describe("useProfileStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it("starts with no profile", () => {
    const store = useProfileStore()
    expect(store.profile).toBeNull()
    expect(store.hasProfile).toBe(false)
    expect(store.profileName).toBe("Guest")
  })

  it("fetchMyProfile loads the profile", async () => {
    api.get.mockResolvedValue({ displayName: "Alex", bio: "hi" })
    const store = useProfileStore()
    await store.fetchMyProfile()
    expect(store.profile.displayName).toBe("Alex")
    expect(store.hasProfile).toBe(true)
    expect(store.profileName).toBe("Alex")
    expect(store.loading).toBe(false)
  })

  it("fetchMyProfile records error on failure", async () => {
    api.get.mockRejectedValue(new Error("nope"))
    const store = useProfileStore()
    await store.fetchMyProfile()
    expect(store.error).toBe("nope")
  })

  it("updateMyProfile saves and updates state", async () => {
    api.put.mockResolvedValue({ displayName: "Alex2" })
    const store = useProfileStore()
    const result = await store.updateMyProfile({ displayName: "Alex2" })
    expect(result.displayName).toBe("Alex2")
    expect(store.profile.displayName).toBe("Alex2")
  })

  it("updateMyProfile throws on failure", async () => {
    api.put.mockRejectedValue(new Error("failsave"))
    const store = useProfileStore()
    await expect(store.updateMyProfile({})).rejects.toThrow("failsave")
    expect(store.error).toBe("failsave")
  })
})
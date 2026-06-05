import { describe, it, expect, beforeEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"

// Mock the api service module
vi.mock("../services/api", () => ({
  api: {
    post: vi.fn(),
  },
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
  getAccessToken: vi.fn(() => null),
}))

import { useAuthStore } from "../stores/useAuthStore"
import { api, setTokens, clearTokens } from "../services/api"

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  it("starts logged out with a Guest displayName", () => {
    const auth = useAuthStore()
    expect(auth.user).toBeNull()
    expect(auth.isLoggedIn).toBe(false)
    expect(auth.displayName).toBe("Guest")
    expect(auth.userId).toBeNull()
  })

  it("login stores tokens, sets user, flips isLoggedIn", async () => {
    api.post.mockResolvedValue({
      accessToken: "acc",
      refreshToken: "ref",
      user: { id: 1, username: "ryn" },
    })
    const auth = useAuthStore()
    const user = await auth.login({ username: "ryn", password: "pw" })

    expect(api.post).toHaveBeenCalledWith("/auth/login", { username: "ryn", password: "pw" })
    expect(setTokens).toHaveBeenCalledWith({ accessToken: "acc", refreshToken: "ref" })
    expect(auth.user).toEqual({ id: 1, username: "ryn" })
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.displayName).toBe("ryn")
    expect(auth.userId).toBe(1)
    expect(user.username).toBe("ryn")
  })

  it("register creates account then auto-logs-in", async () => {
    api.post
      .mockResolvedValueOnce({ id: 2, username: "newbie" }) // register
      .mockResolvedValueOnce({
        accessToken: "a",
        refreshToken: "r",
        user: { id: 2, username: "newbie" },
      }) // login

    const auth = useAuthStore()
    await auth.register({
      username: "newbie",
      email: "n@test.com",
      password: "pw",
      displayName: "Newbie",
    })

    expect(api.post).toHaveBeenCalledTimes(2)
    expect(auth.user.username).toBe("newbie")
    expect(auth.isLoggedIn).toBe(true)
  })

  it("logout revokes server-side and clears local state", async () => {
    localStorage.setItem("refreshToken", "ref")
    api.post.mockResolvedValue({ message: "Logged out" })

    const auth = useAuthStore()
    auth.user = { id: 1, username: "ryn" }
    auth.isLoggedIn = true

    await auth.logout()

    expect(api.post).toHaveBeenCalledWith("/auth/logout", { refreshToken: "ref" })
    expect(clearTokens).toHaveBeenCalled()
    expect(auth.user).toBeNull()
    expect(auth.isLoggedIn).toBe(false)
  })

  it("logout still clears state even if the server call fails", async () => {
    localStorage.setItem("refreshToken", "ref")
    api.post.mockRejectedValue(new Error("network down"))

    const auth = useAuthStore()
    auth.user = { id: 1, username: "ryn" }
    auth.isLoggedIn = true

    await auth.logout()

    expect(clearTokens).toHaveBeenCalled()
    expect(auth.user).toBeNull()
    expect(auth.isLoggedIn).toBe(false)
  })
})
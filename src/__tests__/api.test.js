import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  api,
} from "../services/api"

describe("api service", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("setTokens stores both tokens, getters read them back", () => {
    setTokens({ accessToken: "abc", refreshToken: "xyz" })
    expect(getAccessToken()).toBe("abc")
    expect(getRefreshToken()).toBe("xyz")
  })

  it("setTokens with only accessToken leaves refresh untouched", () => {
    setTokens({ accessToken: "a1", refreshToken: "r1" })
    setTokens({ accessToken: "a2" })
    expect(getAccessToken()).toBe("a2")
    expect(getRefreshToken()).toBe("r1")
  })

  it("clearTokens removes both", () => {
    setTokens({ accessToken: "abc", refreshToken: "xyz" })
    clearTokens()
    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it("api.get makes a GET request and returns json", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: 1 }],
    })
    const result = await api.get("/posts")
    expect(result).toEqual([{ id: 1 }])
    expect(fetch).toHaveBeenCalledOnce()
  })

  it("api.post sends a body and attaches the token header", async () => {
    setTokens({ accessToken: "tok123" })
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 5 }),
    })
    const result = await api.post("/posts", { content: "hi" })
    expect(result).toEqual({ id: 5 })
    const callArgs = fetch.mock.calls[0][1]
    expect(callArgs.method).toBe("POST")
    expect(callArgs.headers.Authorization).toBe("Bearer tok123")
    expect(callArgs.body).toBe(JSON.stringify({ content: "hi" }))
  })

  it("api.put and api.delete use correct methods", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    })
    await api.put("/posts/1", { content: "edit" })
    expect(fetch.mock.calls[0][1].method).toBe("PUT")
    await api.delete("/posts/1")
    expect(fetch.mock.calls[1][1].method).toBe("DELETE")
  })

  it("throws on a non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: "Bad request" }),
    })
    await expect(api.get("/bad")).rejects.toThrow("Bad request")
  })

  it("refreshes the token on 401 then retries", async () => {
    setTokens({ accessToken: "expired", refreshToken: "refresh1" })
    global.fetch = vi
      .fn()
      // first call: 401 expired
      .mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ error: "expired" }) })
      // refresh call: returns new access token
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ accessToken: "fresh" }) })
      // retry: success
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ id: 1 }) })

    const result = await api.get("/posts")
    expect(result).toEqual({ id: 1 })
    expect(getAccessToken()).toBe("fresh")
    expect(fetch).toHaveBeenCalledTimes(3)
  })
})
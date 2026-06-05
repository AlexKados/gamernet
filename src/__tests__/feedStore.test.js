import { describe, it, expect, beforeEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"

// Mock api service
vi.mock("../services/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock socket service — capture the handler so we can fire events manually
const socketHandlers = {}
vi.mock("../services/socket", () => ({
  socket: {
    off: vi.fn(),
    on: vi.fn((event, cb) => {
      socketHandlers[event] = cb
    }),
  },
}))

import { useFeedStore } from "../stores/useFeedStore"
import { api } from "../services/api"

describe("useFeedStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    for (const k in socketHandlers) delete socketHandlers[k]
  })

  it("starts empty", () => {
    const feed = useFeedStore()
    expect(feed.posts).toEqual([])
    expect(feed.postCount).toBe(0)
  })

  it("fetchPosts maps API data into UI shape", async () => {
    api.get.mockResolvedValue([
      {
        id: 1,
        content: "hello",
        userId: 3,
        gameId: 2,
        createdAt: "2024-01-01T00:00:00Z",
        User: { username: "ryn" },
        Game: { name: "BG3" },
      },
    ])
    const feed = useFeedStore()
    await feed.fetchPosts()

    expect(feed.postCount).toBe(1)
    expect(feed.posts[0].author).toBe("ryn")
    expect(feed.posts[0].game).toBe("BG3")
    expect(feed.loading).toBe(false)
  })

  it("fetchPosts handles missing User/Game with fallbacks", async () => {
    api.get.mockResolvedValue([
      { id: 2, content: "x", userId: 1, gameId: null, createdAt: "2024-01-01T00:00:00Z" },
    ])
    const feed = useFeedStore()
    await feed.fetchPosts()
    expect(feed.posts[0].author).toBe("unknown")
    expect(feed.posts[0].game).toBe("Unknown game")
  })

  it("fetchPosts records error on failure", async () => {
    api.get.mockRejectedValue(new Error("boom"))
    const feed = useFeedStore()
    await feed.fetchPosts()
    expect(feed.error).toBe("boom")
    expect(feed.loading).toBe(false)
  })

  it("getPostById finds a post", async () => {
    api.get.mockResolvedValue([
      { id: 7, content: "c", userId: 1, gameId: 1, createdAt: "2024-01-01T00:00:00Z", User: { username: "a" }, Game: { name: "g" } },
    ])
    const feed = useFeedStore()
    await feed.fetchPosts()
    expect(feed.getPostById(7).content).toBe("c")
    expect(feed.getPostById("7").content).toBe("c")
    expect(feed.getPostById(999)).toBeUndefined()
  })

  it("addPost optimistically prepends the new post", async () => {
    api.post.mockResolvedValue({ id: 10, content: "new", userId: 1, gameId: 1 })
    const feed = useFeedStore()
    await feed.addPost({ content: "new", userId: 1, gameId: 1, author: "ryn", game: "CS2" })
    expect(feed.posts[0].id).toBe(10)
    expect(feed.posts[0].author).toBe("ryn")
    expect(feed.posts[0].game).toBe("CS2")
  })

  it("addPost records error on failure", async () => {
    api.post.mockRejectedValue(new Error("fail"))
    const feed = useFeedStore()
    await expect(
      feed.addPost({ content: "x", userId: 1, gameId: 1 })
    ).rejects.toThrow("fail")
    expect(feed.error).toBe("fail")
  })

  it("deletePost removes a post", async () => {
    api.get.mockResolvedValue([
      { id: 1, content: "a", userId: 1, gameId: 1, createdAt: "2024-01-01T00:00:00Z", User: { username: "u" }, Game: { name: "g" } },
    ])
    api.delete.mockResolvedValue({})
    const feed = useFeedStore()
    await feed.fetchPosts()
    await feed.deletePost(1)
    expect(feed.postCount).toBe(0)
  })

  it("deletePost records error on failure", async () => {
    api.get.mockResolvedValue([
      { id: 1, content: "a", userId: 1, gameId: 1, createdAt: "2024-01-01T00:00:00Z", User: { username: "u" }, Game: { name: "g" } },
    ])
    api.delete.mockRejectedValue(new Error("delfail"))
    const feed = useFeedStore()
    await feed.fetchPosts()
    await expect(feed.deletePost(1)).rejects.toThrow("delfail")
    expect(feed.error).toBe("delfail")
  })

  it("toggleLike flips liked state and adjusts count", async () => {
    api.get.mockResolvedValue([
      { id: 1, content: "a", userId: 1, gameId: 1, createdAt: "2024-01-01T00:00:00Z", User: { username: "u" }, Game: { name: "g" } },
    ])
    const feed = useFeedStore()
    await feed.fetchPosts()
    const before = feed.posts[0].likes
    feed.toggleLike(1)
    expect(feed.posts[0].liked).toBe(true)
    expect(feed.posts[0].likes).toBe(before + 1)
    feed.toggleLike(1)
    expect(feed.posts[0].liked).toBe(false)
    expect(feed.posts[0].likes).toBe(before)
  })

  it("initRealtime adds incoming posts from the socket", () => {
    const feed = useFeedStore()
    feed.initRealtime()
    // simulate the server pushing a new post
    socketHandlers["post:created"]({
      id: 99,
      content: "live post",
      userId: 2,
      gameId: 1,
      User: { username: "remote" },
      Game: { name: "LoL" },
    })
    expect(feed.posts[0].id).toBe(99)
    expect(feed.posts[0].author).toBe("remote")
  })

  it("initRealtime dedupes posts already in the feed", async () => {
    api.get.mockResolvedValue([
      { id: 99, content: "x", userId: 1, gameId: 1, createdAt: "2024-01-01T00:00:00Z", User: { username: "u" }, Game: { name: "g" } },
    ])
    const feed = useFeedStore()
    await feed.fetchPosts()
    feed.initRealtime()
    socketHandlers["post:created"]({ id: 99, content: "dup", userId: 1, gameId: 1, User: { username: "u" }, Game: { name: "g" } })
    expect(feed.postCount).toBe(1) // not added twice
  })
})
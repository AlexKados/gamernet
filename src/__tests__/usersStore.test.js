import { describe, it, expect, beforeEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useUsersStore } from "../stores/useUsersStore"

describe("useUsersStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("starts with 2 seed users", () => {
    const users = useUsersStore()
    expect(users.userCount).toBe(2)
  })

  it("followingCount counts only followed users", () => {
    const users = useUsersStore()
    expect(users.followingCount).toBe(1)
  })

  it("getUserById finds a user by id (string or number)", () => {
    const users = useUsersStore()
    expect(users.getUserById(1).name).toBe("Nina")
    expect(users.getUserById("2").name).toBe("Tom")
    expect(users.getUserById(999)).toBeUndefined()
  })

  it("toggleFollow flips a user's following state", () => {
    const users = useUsersStore()
    users.toggleFollow(1)
    expect(users.getUserById(1).following).toBe(true)
    expect(users.followingCount).toBe(2)
  })

  it("setUsers replaces the whole list", () => {
    const users = useUsersStore()
    users.setUsers([{ id: 9, name: "Zed", following: false }])
    expect(users.userCount).toBe(1)
    expect(users.getUserById(9).name).toBe("Zed")
  })
})
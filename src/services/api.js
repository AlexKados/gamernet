const BASE_URL = "http://localhost:3000/api"

// Token helpers — stored in localStorage so they survive refreshes
export function getAccessToken() {
  return localStorage.getItem("accessToken")
}
export function getRefreshToken() {
  return localStorage.getItem("refreshToken")
}
export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("accessToken", accessToken)
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
}
export function clearTokens() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

async function request(path, options = {}, retry = true) {
  const token = getAccessToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  // Access token expired? Try refreshing once, then retry the request.
  if (res.status === 401 && retry && getRefreshToken()) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return request(path, options, false)
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  return res.json()
}

// Trade the refresh token for a new access token
async function tryRefresh() {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    })
    if (!res.ok) {
      clearTokens()
      return false
    }
    const data = await res.json()
    setTokens({ accessToken: data.accessToken })
    return true
  } catch {
    clearTokens()
    return false
  }
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
}
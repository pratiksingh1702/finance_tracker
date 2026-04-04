
const PREFIX = 'fd_'

export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch { return null }
  },
  set: (key, value) => {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch {}
  },
  remove: (key) => {
    try { localStorage.removeItem(PREFIX + key) } catch {}
  },
  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k))
    } catch {}
  },
}

export const TOKEN_KEY      = 'access_token'
export const REFRESH_KEY    = 'refresh_token'
export const USER_KEY       = 'user'

export const getToken       = ()      => storage.get(TOKEN_KEY)
export const setToken       = (t)     => storage.set(TOKEN_KEY, t)
export const getRefreshToken= ()      => storage.get(REFRESH_KEY)
export const setRefreshToken= (t)     => storage.set(REFRESH_KEY, t)
export const getUser        = ()      => storage.get(USER_KEY)
export const setUser        = (u)     => storage.set(USER_KEY, u)
export const clearAuth      = ()      => {
  storage.remove(TOKEN_KEY)
  storage.remove(REFRESH_KEY)
  storage.remove(USER_KEY)
}
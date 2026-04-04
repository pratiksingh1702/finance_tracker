
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { API_BASE_URL } from '@/constants/api.constants'
import { getToken, getRefreshToken, setToken, setRefreshToken, clearAuth } from '@/utils/storage'
import { ENDPOINTS } from '@/constants/api.constants'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Track if we're refreshing to avoid parallel refresh calls
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

// ── Request interceptor — attach JWT ──────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor — handle 401 with refresh ────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`
            return apiClient(original)
          })
          .catch(Promise.reject)
      }

      original._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearAuth()
        toast.error('Session expired. Please sign in again.')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH_REFRESH}`, { refreshToken })
        const { accessToken, refreshToken: newRefresh } = data.data
        setToken(accessToken)
        setRefreshToken(newRefresh)
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
        processQueue(null, accessToken)
        original.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuth()
        toast.error('Session expired. Please sign in again.')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
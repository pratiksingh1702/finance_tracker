// Auth injection is handled centrally in api.client.js.
// This file exports a helper to manually attach a token (e.g. during SSR or testing).
import apiClient from '../api.client'

export const attachToken = (token) => {
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
}

export const removeToken = () => {
  delete apiClient.defaults.headers.common.Authorization
}
import { createAsyncThunk } from '@reduxjs/toolkit'
import authService from '@/services/auth.service'
import { setToken, setRefreshToken, setUser, clearAuth } from '@/utils/storage'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('📡 [LOGIN THUNK] Request payload:', credentials)

      const response = await authService.login(credentials)

      console.log('📥 [LOGIN THUNK] Raw response:', response)

      const { data } = response
      const { user, accessToken, refreshToken } = data.data

      setToken(accessToken)
      setRefreshToken(refreshToken)
      setUser(user)

      console.log('💾 Tokens stored in localStorage')

      return { user }

    } catch (err) {
      console.error('❌ [LOGIN THUNK] Error:', err)

      console.log('❌ [LOGIN THUNK] Error response:', err.response)

      return rejectWithValue(
        err.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await authService.register(userData)
      const { tokens, user } = data.data
      setToken(tokens.access.token)
      setRefreshToken(tokens.refresh.token)
      setUser(user)
      return { user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const getMeThunk = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.getMe()
      setUser(data.data)
      return data.data
    } catch (err) {
      clearAuth()
      return rejectWithValue(err.response?.data?.message || 'Session expired')
    }
  }
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    clearAuth()
    return null
  }
)

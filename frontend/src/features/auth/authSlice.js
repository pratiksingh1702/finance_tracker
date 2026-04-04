import { createSlice } from '@reduxjs/toolkit'
import { loginThunk, registerThunk, getMeThunk, logoutThunk } from './authThunks'
import { getUser } from '@/utils/storage'

const initialState = {
  user:        getUser(),
  loading:     false,
  error:       null,
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    setUser:    (state, { payload }) => { state.user = payload },
    setInitialized: (state) => { state.initialized = true },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(loginThunk.pending,    (s) => { s.loading = true;  s.error = null })
      .addCase(loginThunk.fulfilled,  (s, { payload }) => { s.loading = false; s.user = payload.user; s.initialized = true })
      .addCase(loginThunk.rejected,   (s, { payload }) => { s.loading = false; s.error = payload })
    // register
      .addCase(registerThunk.pending,   (s) => { s.loading = true;  s.error = null })
      .addCase(registerThunk.fulfilled, (s, { payload }) => { s.loading = false; s.user = payload.user; s.initialized = true })
      .addCase(registerThunk.rejected,  (s, { payload }) => { s.loading = false; s.error = payload })
    // getMe
      .addCase(getMeThunk.pending,    (s) => { s.loading = true })
      .addCase(getMeThunk.fulfilled,  (s, { payload }) => { s.loading = false; s.user = payload; s.initialized = true })
      .addCase(getMeThunk.rejected,   (s) => { s.loading = false; s.user = null; s.initialized = true })
    // logout
      .addCase(logoutThunk.fulfilled, (s) => { s.user = null; s.error = null })
  },
})

export const { clearError, setUser, setInitialized } = authSlice.actions
export default authSlice.reducer
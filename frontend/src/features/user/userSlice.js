import { createSlice } from '@reduxjs/toolkit'
import { fetchUsersThunk, fetchUserByIdThunk, updateUserRoleThunk, deactivateUserThunk } from './userThunks'

const initialState = {
  users:    [],
  selected: null,
  loading:  false,
  error:    null,
  meta:     null,
  filters:  { role: '', status: '', search: '', page: 1, limit: 10 },
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFilters:   (s, { payload }) => { s.filters = { ...s.filters, ...payload, page: 1 } },
    setPage:      (s, { payload }) => { s.filters.page = payload },
    clearError:   (s) => { s.error = null },
    setSelected:  (s, { payload }) => { s.selected = payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending,   (s) => { s.loading = true; s.error = null })
      .addCase(fetchUsersThunk.fulfilled, (s, { payload }) => {
        s.loading = false; s.users = payload.data; s.meta = payload.meta
      })
      .addCase(fetchUsersThunk.rejected,  (s, { payload }) => { s.loading = false; s.error = payload })

      .addCase(fetchUserByIdThunk.fulfilled, (s, { payload }) => { s.selected = payload })
      
      .addCase(updateUserRoleThunk.fulfilled, (s, { payload }) => {
        const idx = s.users.findIndex(u => u._id === payload._id)
        if (idx !== -1) s.users[idx] = payload
        if (s.selected?._id === payload._id) s.selected = payload
      })

      .addCase(deactivateUserThunk.fulfilled, (s, { payload: id }) => {
        const idx = s.users.findIndex(u => u._id === id)
        if (idx !== -1) s.users[idx].isActive = false
        if (s.selected?._id === id) s.selected.isActive = false
      })
  },
})

export const { setFilters, setPage, clearError, setSelected } = userSlice.actions
export default userSlice.reducer

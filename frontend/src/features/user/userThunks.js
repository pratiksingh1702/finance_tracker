import { createAsyncThunk } from '@reduxjs/toolkit'
import userService from '@/services/user.service'

export const fetchUsersThunk = createAsyncThunk(
  'user/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters } = getState().user
      const { data } = await userService.getUsers(filters)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users')
    }
  }
)

export const fetchUserByIdThunk = createAsyncThunk(
  'user/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await userService.getUserById(id)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user details')
    }
  }
)

export const updateUserRoleThunk = createAsyncThunk(
  'user/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await userService.updateUserRole(id, role)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update user role')
    }
  }
)

export const deactivateUserThunk = createAsyncThunk(
  'user/deactivateUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deactivateUser(id)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to deactivate user')
    }
  }
)

import { createAsyncThunk } from '@reduxjs/toolkit'
import analyticsService from '@/services/analytics.service'

export const fetchDashboardThunk = createAsyncThunk(
  'analytics/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await analyticsService.getDashboardData()
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard data')
    }
  }
)

export const fetchMonthlyTrendsThunk = createAsyncThunk(
  'analytics/fetchMonthlyTrends',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await analyticsService.getMonthlyTrends()
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch monthly trends')
    }
  }
)

export const fetchCategoryBreakdownThunk = createAsyncThunk(
  'analytics/fetchCategoryBreakdown',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await analyticsService.getCategoryBreakdown()
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch category breakdown')
    }
  }
)

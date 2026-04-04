import { createSlice } from '@reduxjs/toolkit'
import { fetchDashboardThunk, fetchMonthlyTrendsThunk, fetchCategoryBreakdownThunk } from './analyticsThunks'

const initialState = {
  dashboard:         null,
  summary:           null,
  monthlyTrends:     [],
  weeklyTrends:      [],
  categoryBreakdown: [],
  recentActivity:    [],
  loading:           false,
  error:             null,
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: { clearError: (s) => { s.error = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending,   (s) => { s.loading = true; s.error = null })
      .addCase(fetchDashboardThunk.fulfilled, (s, { payload }) => {
        s.loading           = false
        s.dashboard         = payload
        s.summary           = payload.summary
        s.monthlyTrends     = payload.monthlyTrends
        s.categoryBreakdown = payload.categoryBreakdown
        s.recentActivity    = payload.recentActivity
      })
      .addCase(fetchDashboardThunk.rejected,  (s, { payload }) => { s.loading = false; s.error = payload })

      .addCase(fetchMonthlyTrendsThunk.fulfilled, (s, { payload }) => { s.monthlyTrends = payload })
      .addCase(fetchCategoryBreakdownThunk.fulfilled, (s, { payload }) => { s.categoryBreakdown = payload })
  },
})

export const { clearError } = analyticsSlice.actions
export default analyticsSlice.reducer
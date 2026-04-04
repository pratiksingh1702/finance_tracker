import { createSelector } from '@reduxjs/toolkit'

const selectAnalytics = (state) => state.analytics

export const selectDashboardData = createSelector(selectAnalytics, (a) => a.dashboard)
export const selectSummary = createSelector(selectAnalytics, (a) => a.summary)
export const selectMonthlyTrends = createSelector(selectAnalytics, (a) => a.monthlyTrends)
export const selectCategoryBreakdown = createSelector(selectAnalytics, (a) => a.categoryBreakdown)
export const selectAnalyticsLoading = createSelector(selectAnalytics, (a) => a.loading)

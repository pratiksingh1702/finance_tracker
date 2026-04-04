import apiClient from './api.client'
import { ENDPOINTS } from '@/constants/api.constants'

const analyticsService = {
  getDashboardData:     () => apiClient.get(ENDPOINTS.ANALYTICS_DASHBOARD),
  getSummary:           () => apiClient.get(ENDPOINTS.ANALYTICS_SUMMARY),
  getCategoryBreakdown: () => apiClient.get(ENDPOINTS.ANALYTICS_CATEGORIES),
  getMonthlyTrends:     () => apiClient.get(ENDPOINTS.ANALYTICS_MONTHLY),
  getWeeklyTrends:      () => apiClient.get(ENDPOINTS.ANALYTICS_WEEKLY),
  getRecentActivity:    () => apiClient.get(ENDPOINTS.ANALYTICS_RECENT),
}

export default analyticsService

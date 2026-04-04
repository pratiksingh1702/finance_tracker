
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN:    '/auth/login',
  AUTH_REFRESH:  '/auth/refresh',
  AUTH_ME:       '/auth/me',

  // Users
  USERS:         '/users',
  USER_BY_ID:    (id) => `/users/${id}`,
  USER_ROLE:     (id) => `/users/${id}/role`,
  USER_DEACTIVATE: (id) => `/users/${id}/deactivate`,

  // Transactions
  TRANSACTIONS:         '/transactions',
  TRANSACTION_BY_ID:    (id) => `/transactions/${id}`,

  // Categories
  CATEGORIES:        '/categories',
  CATEGORY_BY_ID:    (id) => `/categories/${id}`,

  // Analytics
  ANALYTICS_DASHBOARD:  '/analytics/dashboard',
  ANALYTICS_SUMMARY:    '/analytics/summary',
  ANALYTICS_CATEGORIES: '/analytics/categories',
  ANALYTICS_MONTHLY:    '/analytics/trends/monthly',
  ANALYTICS_WEEKLY:     '/analytics/trends/weekly',
  ANALYTICS_RECENT:     '/analytics/recent',
}
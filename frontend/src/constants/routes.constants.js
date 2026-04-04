export const ROUTES = {
  AUTH: {
    LOGIN:    '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
  },
  DASHBOARD: {
    OVERVIEW:  '/dashboard',
    ANALYTICS: '/analytics',
  },
  TRANSACTIONS: {
    LIST:   '/transactions',
    CREATE: '/transactions/new',
    DETAIL: (id) => `/transactions/${id}`,
  },
  USERS: {
    LIST:   '/users',
    DETAIL: (id) => `/users/${id}`,
  },
  ERRORS: {
    NOT_FOUND:    '/404',
    UNAUTHORIZED: '/unauthorized',
  },
}

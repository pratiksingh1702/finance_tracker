import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithRouter } from './test-utils'
import { router } from '@/app/router'
import { ROUTES } from '@/constants/routes.constants'
import { setToken, setUser, clearAuth } from '@/utils/storage'
import authService from '@/services/auth.service'
import analyticsService from '@/services/analytics.service'
import financeService from '@/services/finance.service'
import { toast } from 'react-hot-toast'

// Mock the services and toast
vi.mock('@/services/auth.service', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn(),
    getMe: vi.fn(),
    refresh: vi.fn(),
  }
}))
vi.mock('@/services/analytics.service', () => ({
  default: {
    getDashboardData: vi.fn(),
    getSummary: vi.fn(),
    getCategoryBreakdown: vi.fn(),
    getMonthlyTrends: vi.fn(),
    getWeeklyTrends: vi.fn(),
    getRecentActivity: vi.fn(),
  }
}))
vi.mock('@/services/finance.service', () => ({
  default: {
    getTransactions: vi.fn(),
    getTransaction: vi.fn(),
    createTransaction: vi.fn(),
    updateTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    getCategories: vi.fn(),
  }
}))
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock lazy-loaded pages to be synchronous in tests
vi.mock('@/pages/dashboard/OverviewPage', () => ({ default: () => <div>Financial Overview</div> }))
vi.mock('@/pages/dashboard/AnalyticsPage', () => ({ default: () => <div>Financial Analytics</div> }))
vi.mock('@/pages/errors/UnauthorizedPage', () => ({ default: () => <div>Access Denied</div> }))
vi.mock('@/pages/errors/NotFoundPage', () => ({ default: () => <div>Not Found</div> }))
vi.mock('@/pages/transactions/TransactionsPage', () => ({ default: () => <div>Transactions</div> }))
vi.mock('@/pages/users/UsersPage', () => ({ default: () => <div>Users</div> }))
vi.mock('@/pages/transactions/CreateTransactionPage', () => ({ default: () => <div>Create Transaction</div> }))
vi.mock('@/pages/transactions/TransactionDetailPage', () => ({ default: () => <div>Transaction Detail</div> }))
vi.mock('@/pages/users/UserDetailPage', () => ({ default: () => <div>User Detail</div> }))

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearAuth()
    window.localStorage.clear()

    // Default mocks for background service calls
    analyticsService.getDashboardData.mockResolvedValue({ data: { data: { summary: {}, recentActivity: [] } } })
    analyticsService.getMonthlyTrends.mockResolvedValue({ data: { data: [] } })
    analyticsService.getCategoryBreakdown.mockResolvedValue({ data: { data: [] } })
    financeService.getTransactions.mockResolvedValue({ data: { data: [], meta: { total: 0 } } })
    financeService.getCategories.mockResolvedValue({ data: { data: [] } })
  })

  it('should redirect unauthenticated users to the login page when accessing protected routes', async () => {
    renderWithRouter(router.routes, { initialEntries: [ROUTES.DASHBOARD.OVERVIEW] })

    // Wait for redirection to login
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    })
  })

  it('should redirect authenticated users away from the login page', async () => {
    const mockUser = { id: '1', email: 'test@example.com', role: 'user' }
    setUser(mockUser)
    setToken('mock-token')

    renderWithRouter(router.routes, { 
      initialEntries: [ROUTES.AUTH.LOGIN],
      preloadedState: { auth: { user: mockUser, initialized: true } }
    })

    expect(await screen.findByText(/Financial Overview/i, {}, { timeout: 5000 })).toBeInTheDocument()
  })

  it('should handle successful login correctly', async () => {
    const credentials = { email: 'admin@finance-dashboard.com', password: 'password123' }
    const mockResponse = {
      data: {
        data: {
          user: { id: '1', email: credentials.email, role: 'admin' },
          tokens: {
            access: { token: 'access-token' },
            refresh: { token: 'refresh-token' }
          }
        }
      }
    }

    authService.login.mockResolvedValueOnce(mockResponse)

    renderWithRouter(router.routes, { initialEntries: [ROUTES.AUTH.LOGIN] })

    // Fill the login form
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: credentials.email } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: credentials.password } })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    // Verify service call
    expect(authService.login).toHaveBeenCalledWith(credentials)

    // Verify success toast and redirection
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Welcome back!')
    })
    
    expect(await screen.findByText(/Financial Overview/i, {}, { timeout: 5000 })).toBeInTheDocument()
  })

  it('should handle failed login attempts gracefully', async () => {
    const credentials = { email: 'wrong@example.com', password: 'wrongpassword' }
    const errorMessage = 'Invalid credentials'
    
    authService.login.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    })

    renderWithRouter(router.routes, { initialEntries: [ROUTES.AUTH.LOGIN] })

    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: credentials.email } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: credentials.password } })
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
      // Should still be on login page
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
    })
  })

  it('should handle logout correctly', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' }
    setUser(mockUser)
    setToken('mock-token')

    renderWithRouter(router.routes, { 
      initialEntries: [ROUTES.DASHBOARD.OVERVIEW],
      preloadedState: { auth: { user: mockUser, initialized: true } }
    })

    // Wait for the overview to load first
    expect(await screen.findByText(/Financial Overview/i)).toBeInTheDocument()

    // Find and click logout button
    const logoutButton = screen.getByRole('button', { name: /Logout/i })
    fireEvent.click(logoutButton)

    // Verify storage is cleared and redirected to login
    await waitFor(() => {
      expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
      expect(window.localStorage.getItem('token')).toBeNull()
      expect(window.localStorage.getItem('user')).toBeNull()
    })
  })

  it('should redirect back to intended page after login', async () => {
    // Attempt to access analytics (protected)
    renderWithRouter(router.routes, { initialEntries: [ROUTES.DASHBOARD.ANALYTICS] })

    // Redirected to login
    expect(await screen.findByText(/Sign In/i)).toBeInTheDocument()

    // Mock successful login
    const mockResponse = {
      data: {
        data: {
          user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'user' },
          tokens: { 
            access: { token: 't1' }, 
            refresh: { token: 'r1' } 
          }
        }
      }
    }
    authService.login.mockResolvedValueOnce(mockResponse)

    // Login
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }))

    // Should be redirected back to analytics
    expect(await screen.findByText(/Financial Analytics/i, {}, { timeout: 5000 })).toBeInTheDocument()
  })

  it('should prevent non-admin users from accessing admin routes', async () => {
    const mockUser = { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' }
    setUser(mockUser)
    setToken('user-token')

    renderWithRouter(router.routes, { 
      initialEntries: [ROUTES.USERS.LIST],
      preloadedState: { auth: { user: mockUser, initialized: true } }
    })

    // Should redirect to unauthorized page
    expect(await screen.findByText(/Access Denied/i)).toBeInTheDocument()
  })

  it('should handle registration correctly', async () => {
    const userData = { name: 'New User', email: 'new@example.com', password: 'password123' }
    const mockResponse = {
      data: {
        data: {
          user: { id: '3', ...userData, role: 'user' },
          tokens: {
            access: { token: 'new-access-token' },
            refresh: { token: 'new-refresh-token' }
          }
        }
      }
    }

    authService.register.mockResolvedValueOnce(mockResponse)

    renderWithRouter(router.routes, { initialEntries: [ROUTES.AUTH.REGISTER] })

    // Fill registration form
    fireEvent.change(await screen.findByLabelText(/Full Name/i), { target: { value: userData.name } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: userData.email } })
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: userData.password } })
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: userData.password } })

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account created successfully!')
    })
    
    expect(await screen.findByText(/Financial Overview/i, {}, { timeout: 5000 })).toBeInTheDocument()
  })
})

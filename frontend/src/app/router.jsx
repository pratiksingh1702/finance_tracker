import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constants'
import { ROLES } from '@/constants/roles.constants'

// Layouts
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Shared
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import PublicRoute from '@/components/shared/PublicRoute'
import RoleGuard from '@/components/shared/RoleGuard'
import Spinner from '@/components/ui/Spinner/Spinner'

// Lazy Pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))

const OverviewPage = lazy(() => import('@/pages/dashboard/OverviewPage'))
const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage'))

const TransactionsPage = lazy(() => import('@/pages/transactions/TransactionsPage'))
const CreateTransactionPage = lazy(() => import('@/pages/transactions/CreateTransactionPage'))
const TransactionDetailPage = lazy(() => import('@/pages/transactions/TransactionDetailPage'))

const UsersPage = lazy(() => import('@/pages/users/UsersPage'))
const UserDetailPage = lazy(() => import('@/pages/users/UserDetailPage'))

const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen" data-testid="loading-spinner">
    <Spinner size="lg" />
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.DASHBOARD.OVERVIEW} replace />,
  },
  // Public Routes
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.AUTH.LOGIN,    element: <Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense> },
          { path: ROUTES.AUTH.REGISTER, element: <Suspense fallback={<LoadingFallback />}><RegisterPage /></Suspense> },
          { path: ROUTES.AUTH.FORGOT_PASSWORD, element: <Suspense fallback={<LoadingFallback />}><ForgotPasswordPage /></Suspense> },
        ],
      },
    ],
  },
  // Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: ROUTES.DASHBOARD.OVERVIEW,  element: <Suspense fallback={<LoadingFallback />}><OverviewPage /></Suspense> },
          { path: ROUTES.DASHBOARD.ANALYTICS, element: <Suspense fallback={<LoadingFallback />}><AnalyticsPage /></Suspense> },
          
          { path: ROUTES.TRANSACTIONS.LIST,   element: <Suspense fallback={<LoadingFallback />}><TransactionsPage /></Suspense> },
          { path: ROUTES.TRANSACTIONS.CREATE, element: <Suspense fallback={<LoadingFallback />}><CreateTransactionPage /></Suspense> },
          { path: ROUTES.TRANSACTIONS.DETAIL(':id'), element: <Suspense fallback={<LoadingFallback />}><TransactionDetailPage /></Suspense> },

          // Admin Only
          {
            element: <RoleGuard allowedRoles={[ROLES.ADMIN]} />,
            children: [
              { path: ROUTES.USERS.LIST,   element: <Suspense fallback={<LoadingFallback />}><UsersPage /></Suspense> },
              { path: ROUTES.USERS.DETAIL(':id'), element: <Suspense fallback={<LoadingFallback />}><UserDetailPage /></Suspense> },
            ],
          },
        ],
      },
    ],
  },
  { path: '/unauthorized', element: <Suspense fallback={<LoadingFallback />}><UnauthorizedPage /></Suspense> },
  { path: '*', element: <Suspense fallback={<LoadingFallback />}><NotFoundPage /></Suspense> },
])

export default router

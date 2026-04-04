import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/constants/routes.constants'

/**
 * PublicRoute prevents logged-in users from accessing public pages like login and register.
 * If the user is authenticated, they are redirected to the dashboard.
 */
const PublicRoute = () => {
  const { user } = useSelector((s) => s.auth)

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD.OVERVIEW} replace />
  }

  return <Outlet />
}

export default PublicRoute

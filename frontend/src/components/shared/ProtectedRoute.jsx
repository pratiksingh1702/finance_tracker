import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/constants/routes.constants'
import { getToken } from '@/utils/storage'

const ProtectedRoute = () => {
  const { user, initialized } = useSelector((s) => s.auth)
  const location = useLocation()
  const token = getToken()

  if (!initialized && token) {
    return null // Loading state handled in App.jsx
  }

  if (!user && !token) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute

import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/constants/routes.constants'

const RoleGuard = ({ allowedRoles }) => {
  const { user } = useSelector((s) => s.auth)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

export default RoleGuard

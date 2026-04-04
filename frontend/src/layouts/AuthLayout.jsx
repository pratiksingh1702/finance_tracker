import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/constants/routes.constants'

const AuthLayout = () => {
  const { user } = useSelector((s) => s.auth)

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD.OVERVIEW} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Finance Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your finances with precision
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

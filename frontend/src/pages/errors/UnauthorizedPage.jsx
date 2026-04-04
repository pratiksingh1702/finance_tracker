import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constants'
import Button from '@/components/ui/Button/Button'

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="p-4 bg-red-100 rounded-full mb-6">
        <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 1a9 9 0 11-18 0 9 9 0 0118 0zM12 9v2m0 0h.01" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Access Denied</h1>
      <p className="text-slate-600 text-center max-w-md mb-8">
        You do not have the necessary permissions to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link to={ROUTES.DASHBOARD.OVERVIEW}>
        <Button variant="outline">Return to Dashboard</Button>
      </Link>
    </div>
  )
}

export default UnauthorizedPage

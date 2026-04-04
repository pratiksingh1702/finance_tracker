import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constants'
import Button from '@/components/ui/Button/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-9xl font-extrabold text-slate-200 tracking-widest">404</h1>
      <div className="bg-blue-600 text-white px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div className="mt-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Oops! We can't find that page.</h2>
        <p className="text-slate-600 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to={ROUTES.DASHBOARD.OVERVIEW} className="block pt-4">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

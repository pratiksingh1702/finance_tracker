import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.constants'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import { toast } from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulated forgot password request
    setIsSubmitted(true)
    toast.success('Reset link sent if account exists')
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
        <p className="text-sm text-slate-600">
          We've sent password reset instructions to <strong>{email}</strong>.
        </p>
        <Link 
          to={ROUTES.AUTH.LOGIN} 
          className="block text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </form>

      <div className="text-center">
        <Link 
          to={ROUTES.AUTH.LOGIN} 
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

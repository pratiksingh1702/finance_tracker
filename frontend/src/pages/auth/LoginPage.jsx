import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '@/features/auth/authThunks'
import { ROUTES } from '@/constants/routes.constants'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import { toast } from 'react-hot-toast'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useSelector((s) => s.auth)

  const [formData, setFormData] = useState({ email: '', password: '' })

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD.OVERVIEW

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
const handleSubmit = async (e) => {
  e.preventDefault()

  console.log('🚀 Submitting login form:', formData)

  try {
    const response = await dispatch(loginThunk(formData)).unwrap()

    console.log('✅ Login SUCCESS response:', response)

    toast.success('Welcome back!')
    navigate(from, { replace: true })

  } catch (err) {
    console.error('❌ Login ERROR:', err)

    // show meaningful message
    if (typeof err === 'string') {
      toast.error(err)
    } else if (err?.message) {
      toast.error(err.message)
    } else {
      toast.error('Login failed')
    }
  }
}

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="admin@finance-dashboard.com"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="space-y-1">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <Link
              to={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage

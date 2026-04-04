import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerThunk } from '@/features/auth/authThunks'
import { ROUTES } from '@/constants/routes.constants'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import { toast } from 'react-hot-toast'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match')
    }

    const result = await dispatch(registerThunk({
      name: formData.name,
      email: formData.email,
      password: formData.password
    }))

    if (!result.error) {
      toast.success('Account created successfully!')
      navigate(ROUTES.DASHBOARD.OVERVIEW)
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          required
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <Button 
          type="submit" 
          className="w-full" 
          loading={loading}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <Link 
            to={ROUTES.AUTH.LOGIN} 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage

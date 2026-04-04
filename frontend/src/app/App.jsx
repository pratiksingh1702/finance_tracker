import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AppProviders from './providers'
import { router } from './router'
import { getMeThunk } from '@/features/auth/authThunks'
import { getToken } from '@/utils/storage'
import Spinner from '@/components/ui/Spinner/Spinner'

const App = () => {
  const dispatch = useDispatch()
  const { initialized } = useSelector((s) => s.auth)

  useEffect(() => {
    const token = getToken()
    if (token) {
      dispatch(getMeThunk())
    } else {
      // If no token, we are initialized (at login/register)
      // but the checkAuth would have handled this if we had a dedicated initialize action
      // For now, let's just mark as initialized if no token
      import('@/features/auth/authSlice').then(({ setInitialized }) => {
        dispatch(setInitialized())
      })
    }
  }, [dispatch])

  if (!initialized && getToken()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}

export default App

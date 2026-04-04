import { useSelector, useDispatch } from 'react-redux'
import { loginThunk, logoutThunk, registerThunk } from '@/features/auth/authThunks'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, loading, error, initialized } = useSelector((s) => s.auth)

  const login = (credentials) => dispatch(loginThunk(credentials))
  const logout = () => dispatch(logoutThunk())
  const register = (data) => dispatch(registerThunk(data))

  return {
    user,
    loading,
    error,
    initialized,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    register,
  }
}

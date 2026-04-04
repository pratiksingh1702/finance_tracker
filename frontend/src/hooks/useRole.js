import { useSelector } from 'react-redux'

export const useRole = () => {
  const { user } = useSelector((s) => s.auth)

  const hasRole = (roles) => {
    if (!user) return false
    if (Array.isArray(roles)) return roles.includes(user.role)
    return user.role === roles
  }

  return {
    role: user?.role,
    hasRole,
    isAdmin: user?.role === 'admin',
  }
}

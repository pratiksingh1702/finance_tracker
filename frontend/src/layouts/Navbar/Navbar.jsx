import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutThunk } from '@/features/auth/authThunks'
import { ROUTES } from '@/constants/routes.constants'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button/Button'
import styles from './Navbar.module.css'

const Navbar = ({ toggleSidebar }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <nav className={styles.navbar}>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-100 lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800 hidden sm:block">
          Welcome, {user?.name}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-slate-600 hover:text-red-600"
        >
          Logout
        </Button>
      </div>
    </nav>
  )
}

export default Navbar

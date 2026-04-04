import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/constants/routes.constants'
import { ROLES } from '@/constants/roles.constants'
import { cn } from '@/utils/cn'
import styles from './Sidebar.module.css'
import SidebarItem from './SidebarItem'

const Sidebar = ({ isOpen }) => {
  const { user } = useSelector((s) => s.auth)
  const isAdmin = user?.role === ROLES.ADMIN

  return (
    <aside className={cn(
      styles.sidebar,
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    )}>
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <span className="text-xl font-bold text-white tracking-wider">FINANCE</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        <SidebarItem 
          to={ROUTES.DASHBOARD.OVERVIEW} 
          label="Overview" 
          icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
        />
        <SidebarItem 
          to={ROUTES.DASHBOARD.ANALYTICS} 
          label="Analytics" 
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
        <SidebarItem 
          to={ROUTES.TRANSACTIONS.LIST} 
          label="Transactions" 
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
        
        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</span>
            </div>
            <SidebarItem 
              to={ROUTES.USERS.LIST} 
              label="User Management" 
              icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </>
        )}
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Signed in as</p>
          <p className="text-sm font-medium text-white truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

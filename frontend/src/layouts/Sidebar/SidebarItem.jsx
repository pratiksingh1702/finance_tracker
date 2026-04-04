import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

const SidebarItem = ({ to, label, icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      )}
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      {label}
    </NavLink>
  )
}

export default SidebarItem

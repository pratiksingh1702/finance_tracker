import React from 'react'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button/Button'

const EmptyState = ({ title, description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border-2 border-dashed border-slate-200 text-center">
      <div className="p-4 bg-slate-50 rounded-full mb-4">
        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 max-w-xs mt-1 mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}

export default EmptyState

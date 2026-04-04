import React from 'react'
import { cn } from '@/utils/cn'
import { Card, CardContent } from '@/components/ui/Card/Card'
import { formatCurrency } from '@/utils/format-currency'

const SummaryCard = ({ title, value, icon, trend, variant = 'default', loading = false }) => {
  const variants = {
    default: 'text-slate-900',
    success: 'text-emerald-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-slate-100 animate-pulse rounded" />
            ) : (
              <h3 className={cn('text-2xl font-bold', variants[variant])}>
                {typeof value === 'number' ? formatCurrency(value) : value}
              </h3>
            )}
          </div>
          <div className={cn(
            'p-3 rounded-lg bg-slate-50',
            variant !== 'default' && `bg-${variant === 'danger' ? 'red' : variant === 'success' ? 'emerald' : 'blue'}-50`
          )}>
            <svg className={cn('w-6 h-6', variants[variant])} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
        </div>
        {trend && !loading && (
          <div className="mt-4 flex items-center gap-2">
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            )}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SummaryCard

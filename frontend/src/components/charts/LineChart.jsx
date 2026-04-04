import React from 'react'
import { useSelector } from 'react-redux'
import { 
  LineChart as ReChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import Spinner from '@/components/ui/Spinner/Spinner'

const LineChart = () => {
  const { monthlyTrends, loading } = useSelector((s) => s.analytics)

  if (loading && !monthlyTrends.length) {
    return <div className="h-full flex items-center justify-center"><Spinner /></div>
  }

  if (!loading && (!monthlyTrends || monthlyTrends.length === 0)) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
        <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <p className="text-sm font-medium">No trend data available</p>
      </div>
    )
  }

  const chartData = monthlyTrends.map(item => ({
    ...item,
    income: item.totalIncome || 0,
    expenses: item.totalExpenses || 0
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="income" 
          stroke="#10b981" 
          strokeWidth={3}
          dot={{ r: 4, fill: '#10b981' }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="expenses" 
          stroke="#ef4444" 
          strokeWidth={3}
          dot={{ r: 4, fill: '#ef4444' }}
          activeDot={{ r: 6 }}
        />
      </ReChart>
    </ResponsiveContainer>
  )
}

export default LineChart

import React from 'react'
import { useSelector } from 'react-redux'
import { 
  BarChart as ReChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts'
import Spinner from '@/components/ui/Spinner/Spinner'

const BarChart = () => {
  const { monthlyTrends, loading } = useSelector((s) => s.analytics)

  if (loading && !monthlyTrends.length) {
    return <div className="h-full flex items-center justify-center"><Spinner /></div>
  }

  if (!loading && (!monthlyTrends || monthlyTrends.length === 0)) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
        <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-sm font-medium">No comparison data available</p>
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
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          tickFormatter={(val) => `$${val}`}
        />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
        <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
      </ReChart>
    </ResponsiveContainer>
  )
}

export default BarChart
